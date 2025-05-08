import { client } from '../Client';

const EmailTemplateService = {
  getAll: async () => {
    try {
      const result = await client.query('SELECT * FROM email_templates');
      // console.log('All Email Templates:', result.rows);
      return result.rows;
    } catch (error) {
      console.log('Error fetching email templates:', error);
      throw error;
    }
  },

  get: async (id) => {
    try {
      const result = await client.query(
        'SELECT * FROM email_templates WHERE id = $1',
        [id]
      );
      if (result.rows.length > 0) {
        // console.log('Email Template Found:', result.rows[0]);
        return result.rows[0];
      } else {
        // console.log('Email template not found');
        return null;
      }
    } catch (error) {
      console.log('Error fetching email template:', error);
      throw error;
    }
  },

  add: async (template) => {
    try {
      const result = await client.query(
        `INSERT INTO email_templates 
         (name, subject, body) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [template.name, template.subject, template.body]
      );
      // console.log('Email Template Created:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.log('Error adding email template:', error);
      throw error;
    }
  },

  update: async (template) => {
    const { id, ...updates } = template;
    try {
      const result = await client.query(
        `UPDATE email_templates 
         SET name = $1, subject = $2, body = $3 
         WHERE id = $4 
         RETURNING *`,
        [updates.name, updates.subject, updates.body, id]
      );
      if (result.rows.length > 0) {
        // console.log('Email Template Updated:', result.rows[0]);
        return result.rows[0];
      } else {
        // console.log('Email template not found');
        return null;
      }
    } catch (error) {
      console.log('Error updating email template:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const result = await client.query(
        'DELETE FROM email_templates WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length > 0) {
        // console.log('Email Template Deleted:', result.rows[0]);
        return result.rows[0];
      } else {
        // console.log('Email template not found');
        return null;
      }
    } catch (error) {
      console.log('Error deleting email template:', error);
      throw error;
    }
  },

  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        // console.log('No IDs provided for deletion.');
        return 0;
      }

      const query = `
        DELETE FROM email_templates
        WHERE id = ANY($1::int[])
        RETURNING *
      `;
      const result = await client.query(query, [ids]);
      // console.log(`Deleted ${result.rowCount} email templates.`);
      return result.rowCount;
    } catch (error) {
      console.log('Error deleting email templates:', error);
      throw error;
    }
  }
};

export default EmailTemplateService;


// import Realm from 'realm'
// import realm from '../database'

// const EmailTemplateService = {
//   getAll: () => JSON.parse(JSON.stringify(realm.objects('EmailTemplate'))),
//   get: (_id) => JSON.parse(JSON.stringify(realm.objectForPrimaryKey('EmailTemplate', _id))),
//   add: (emailTemplate) => {
//     try {
//       realm.write(() => {
//         realm.create('EmailTemplate', emailTemplate)
//       })
//       return emailTemplate // Return the added exercise data
//     } catch (error) {
//       console.log('Error adding exercise:', error)
//       throw error
//     }
//   },
//   update: (template) => {
//     const { _id, ...updates } = template
//     try {
//       realm.write(() => {
//         const existing = realm.objectForPrimaryKey('EmailTemplate', new Realm.BSON.ObjectId(_id))
//         if (existing) {
//           Object.assign(existing, updates)
//         }
//       })
//       return true
//     } catch (error) {
//       console.log('Error updating facility:', error)
//       throw error
//     }
//   },
//   delete: (_id) => {
//     try {
//       realm.write(() => {
//         const emailTemplate = realm.objectForPrimaryKey(
//           'EmailTemplate',
//           new Realm.BSON.ObjectId(_id)
//         )
//         if (emailTemplate) {
//           realm.delete(emailTemplate)
//         }
//       })
//       return true // Indicate successful deletion
//     } catch (error) {
//       console.log('Error deleting emailList:', error)
//       throw error
//     }
//   },
//   deleteAll: (ids) => {
//     try {
//       realm.write(() => {
//         ids.forEach((id) => {
//           const emailList = realm.objectForPrimaryKey('EmailTemplate', new Realm.BSON.ObjectId(id))
//           if (emailList) {
//             realm.delete(emailList)
//           } else {
//             console.warn(`EmailList with id ${id} not found`)
//           }
//         })
//       })
//       return true // Indicate successful deletion
//     } catch (error) {
//       console.log('Error deleting multiple emailLists:', error)
//       throw error
//     }
//   }
// }

// export default EmailTemplateService
