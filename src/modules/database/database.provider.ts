import { DATA_SOURCE } from '../../constants'
import { dataSource } from '../../typeorm'

export const databaseProvider = {
  provide: DATA_SOURCE,
  useFactory: async () => {
    if (!dataSource.isInitialized) {
      await dataSource.initialize()
      try {
        await dataSource.runMigrations()
      } catch (error) {
        console.log(`Migrations Error: ${error}`)
      }
      return dataSource
    }
  },
}
