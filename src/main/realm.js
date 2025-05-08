import Realm from 'realm'
const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID }) // create a new instance of the Realm.App
async function run() {
  // login with an anonymous credential
  await app.logIn(Realm.Credentials.anonymous())

  const DogSchema = {
    name: 'Dog',
    properties: {
      _id: 'int',
      name: 'string',
      age: 'int'
    },
    primaryKey: '_id'
  }

  const realm = await Realm.open({
    schema: [DogSchema],
    sync: {
      user: app.currentUser,
      partitionValue: 'myPartition'
    }
  })

  // The myPartition realm is now synced to the device. You can
  // access it through the `realm` object returned by `Realm.open()`

  // write to the realm
}
run().catch((err) => {
  console.error('Failed to open realm:', err)
})
