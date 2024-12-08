const pool = require("../../app")
const response = require("../res/response")

const getSewa = async (req, res) => {
    try {
      const sql = `SELECT * FROM ViewSewaClient`
      const result = await pool.query(sql)
      response(200, result.rows, "GET is Succefully", res)
    //   res.status(200).json(result.rows);
    } catch (err) {
        response(500, "invalid", "error", err)  
    //   res.status(500).send(err.message);
    }
  }
  module.exports = {
    getSewa,
 }
