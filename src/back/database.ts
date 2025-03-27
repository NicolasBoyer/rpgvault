import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { Utils } from './utils.js'
import { TSheet, TUser } from '../front/javascript/types.js'
import { DB_NAME, DB_URL } from './config.js'
import Auth from './auth.js'

export const client = new MongoClient(DB_URL)
export let db: Db

/**
 * Permet la déclaration de la db (ici un fichier json) et de résoudre les requêtes passées dans la fonction request
 */
export default class Database {
    static sheets: Collection
    private static users: Collection

    static async connect(): Promise<void> {
        try {
            await client.connect()
            db = client.db(DB_NAME)
            console.log('Connected to database : ', DB_NAME)
        } catch (err) {
            console.error('Failed to connect to the database', err)
            throw err
        }
    }

    static async initUserDbAndCollections(id: string): Promise<void> {
        try {
            const userDb = client.db(`${DB_NAME}_${id}`)
            console.log('Connected to user database : ', userDb.databaseName)
            this.sheets = userDb.collection('sheets')
            if (!db) {
                await this.connect()
            }
            this.users = db.collection('users')
        } catch (err) {
            console.error('Failed to connect to the database', err)
            throw err
        }
    }

    /**
     * Retourne ou enregistre des informations dans la db (des fichiers json) en fonction des requêtes reçues dans le resolver
     * Exemple : { "getRecipes": {"map": "title"} } reçu dans request et traité par la fonction get et résolu par la constante resolvers.
     * Retourne ce qui est traité dans la fonction getRecipes : les titres des recettes dans un array
     * À chaque requête doit correspondre une fonction. La key étant la fonction, la value les arguments
     * Autres exemples :
     * { "getRecipes": {"slug": "Tartiflette"} } retourne la recette tartiflette avec ses ingrédients via un objet
     * { "setRecipe": {"slug": "Tagliatelle à la carbonara"} } enregistre {"slug": "Tagliatelle à la carbonara"} dans la db recipes.json
     * @param datas requête à traiter par la fonction
     * @returns {*|[]|*[]} retourne un array si request est un array sinon un objet
     */
    static async request(datas: Record<string, string>[] | Record<string, string>): Promise<TSheet | TSheet[] | { error: string }> {
        const resolvers = {
            async getSheets(args?: Record<string, string>): Promise<TSheet | TSheet[]> {
                let sheets = []
                if (args?.slug) sheets.push(await Database.sheets.findOne({ slug: args.slug }))
                else if (args?.id) sheets.push(await Database.sheets.findOne({ _id: new ObjectId(args.id) }))
                else sheets = await Database.sheets.find().toArray()
                return sheets.length === 1 ? (sheets[0] as unknown as TSheet) : (sheets as unknown as TSheet[])
            },

            async setSheet(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                const name = args.name
                const update = args
                if (!args.id) update.slug = Utils.slugify(name)
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, { $set: update }, { upsert: true })
                return await resolvers.getSheets()
            },

            async removeSheet(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                await Database.sheets.deleteOne({ _id: new ObjectId(args.id) })
                return await resolvers.getSheets()
            },

            async setNotepad(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, { $set: { notepad: args.notepad } }, { upsert: true })
                return await resolvers.getSheets()
            },

            async setBackgroundColor(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, { $set: { backgroundColor: args.color } }, { upsert: true })
                return await resolvers.getSheets()
            },

            async setBackgroundImage(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, { $set: { backgroundImage: args.image } }, { upsert: true })
                return await resolvers.getSheets()
            },

            async setFont(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                // @ts-expect-error : erreur provoquée via la mise à jour de Mongo DB en 6.4.0. Donc probablement une erreur de type par Mongo DB (TODO : revérifier lors de futures mises à jour)
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, { $push: { fonts: { fontFamily: args.fontFamily, fontUrl: args.fontUrl } } })
                return await resolvers.getSheets()
            },

            async setUIBlocksPosition(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                const isUIBlocksExists = ((await resolvers.getSheets({ id: args.id })) as TSheet).ui
                const blockType = Object.keys(args)[0]
                const update = !isUIBlocksExists ? { $set: { ui: args } } : blockType === 'editBlock' ? { $set: { 'ui.editBlock': args[blockType] } } : { $set: { 'ui.selectBlock': args[blockType] } }
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, update, { upsert: true })
                return await resolvers.getSheets()
            },

            async setUIBlocksInterface(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                const isUIBlocksExists = ((await resolvers.getSheets({ id: args.id })) as TSheet).ui
                const update = !isUIBlocksExists ? { $set: { ui: args } } : { $set: { 'ui.interface': args.interface } }
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, update, { upsert: true })
                return await resolvers.getSheets()
            },

            async deleteFont(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                // @ts-expect-error : erreur provoquée via la mise à jour de Mongo DB en 6.4.0. Donc probablement une erreur de type par Mongo DB (TODO : revérifier lors de futures mises à jour)
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, { $pull: { fonts: { fontFamily: { $in: args.fonts } } } })
                return await resolvers.getSheets()
            },

            async setInput(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                const isInputExists = ((await resolvers.getSheets({ id: args.id })) as TSheet).inputs?.some((pInput): boolean => pInput.id === args.inputId)
                const update = isInputExists ? { $set: { 'inputs.$': args.input } } : { $push: { inputs: args.input } }
                const filter = isInputExists ? { _id: new ObjectId(args.id), 'inputs.id': args.inputId } : { _id: new ObjectId(args.id) }
                // @ts-expect-error : erreur provoquée via la mise à jour de Mongo DB en 6.4.0. Donc probablement une erreur de type par Mongo DB (TODO : revérifier lors de futures mises à jour)
                await Database.sheets.updateOne(filter, update)
                return await resolvers.getSheets()
            },

            async deleteInput(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                // @ts-expect-error : erreur provoquée via la mise à jour de Mongo DB en 6.4.0. Donc probablement une erreur de type par Mongo DB (TODO : revérifier lors de futures mises à jour)
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, { $pull: { inputs: { id: args.inputId } } })
                return await resolvers.getSheets()
            },

            async setImage(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                const isImageExists = ((await resolvers.getSheets({ id: args.id })) as TSheet).images?.some((pImage): boolean => pImage.id === args.imageId)
                const update = isImageExists ? { $set: { 'images.$': args.image } } : { $push: { images: args.image } }
                const filter = isImageExists ? { _id: new ObjectId(args.id), 'images.id': args.imageId } : { _id: new ObjectId(args.id) }
                // @ts-expect-error : erreur provoquée via la mise à jour de Mongo DB en 6.4.0. Donc probablement une erreur de type par Mongo DB (TODO : revérifier lors de futures mises à jour)
                await Database.sheets.updateOne(filter, update)
                return await resolvers.getSheets()
            },

            async deleteImage(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                // @ts-expect-error : erreur provoquée via la mise à jour de Mongo DB en 6.4.0. Donc probablement une erreur de type par Mongo DB (TODO : revérifier lors de futures mises à jour)
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, { $pull: { images: { id: args.imageId } } })
                return await resolvers.getSheets()
            },

            async setCheckbox(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                const isCheckboxExists = ((await resolvers.getSheets({ id: args.id })) as TSheet).checkboxes?.some((pCheckbox): boolean => pCheckbox.id === args.checkboxId)
                const update = isCheckboxExists ? { $set: { 'checkboxes.$': args.checkbox } } : { $push: { checkboxes: args.checkbox } }
                const filter = isCheckboxExists ? { _id: new ObjectId(args.id), 'checkboxes.id': args.checkboxId } : { _id: new ObjectId(args.id) }
                // @ts-expect-error : erreur provoquée via la mise à jour de Mongo DB en 6.4.0. Donc probablement une erreur de type par Mongo DB (TODO : revérifier lors de futures mises à jour)
                await Database.sheets.updateOne(filter, update)
                return await resolvers.getSheets()
            },

            async deleteCheckbox(args: Record<string, string>): Promise<TSheet | TSheet[]> {
                // @ts-expect-error : erreur provoquée via la mise à jour de Mongo DB en 6.4.0. Donc probablement une erreur de type par Mongo DB (TODO : revérifier lors de futures mises à jour)
                await Database.sheets.updateOne({ _id: new ObjectId(args.id) }, { $pull: { checkboxes: { id: args.checkboxId } } })
                return await resolvers.getSheets()
            },

            async getUser(id: string): Promise<TUser> {
                return (await Database.users?.findOne({ _id: new ObjectId(id) })) as unknown as TUser
            },

            async setUser(args: Record<string, string>): Promise<TUser> {
                if (args.password) {
                    args.password = await Auth.hashPassword(args.password)
                }
                const { _id, ...entries } = args
                await Database.users.updateOne({ _id: new ObjectId(args._id) }, { $set: entries }, { upsert: true })
                return await resolvers.getUser(_id)
            },
        }
        const resArr: TSheet[] = []
        let resolver: (args: string) => Promise<TSheet | TSheet[]>
        if (Array.isArray(datas)) {
            for (const data of datas) {
                const func = Object.keys(data)[0]
                resolver = resolvers[func as keyof typeof resolver]
                if (!resolver) return { error: `no resolver function for ${func}` }
                resArr.push(<TSheet>await resolver(Object.values(data)[0]))
            }
            return resArr
        }
        const func = Object.keys(datas)[0]
        resolver = resolvers[func as keyof typeof resolver]
        if (!resolver) return { error: `no resolver function for ${func}` }
        return await resolver(Object.values(datas)[0])
    }
}
