// import Realm from 'realm'
// import User from './models/UserModel'
// import Membership from './models/MembershipModel' // Import other models as needed

import realm from './db/database'

// Function to seed the database
export async function seedDatabase() {

  async function deleteAllExercises() {
    realm.write(() => {
      // Delete all Exercise objects
      const allExercises = realm.objects('Exercise')
      realm.delete(allExercises)
    })

    // realm.close()
  }

  deleteAllExercises()
    .then(() => {
      // // console.log('All exercises have been deleted.')
    })
    .catch((error) => {
      console.error('Error deleting exercises:', error)
    })

  // // console.log('Database seeded with exercises.')
}
