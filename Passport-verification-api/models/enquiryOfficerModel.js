import db from '../db.js'; 

export const getSpecialEnquiryOfficers = async (EntryUserID) => {
  return ((resolve, reject) => {
    const query = `CALL sp_getSpecialEnquiryofficersDetails(?);`;

    db.query(query, [EntryUserID], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return reject(error);
      }

      if (!results[0] || results[0].length === 0) {
        return resolve({ message: 'No special enquiry officers found.', officers: [] });
      }

      resolve({ message: 'Special enquiry officers retrieved successfully.', officers: results[0] });
    });
  });
};
