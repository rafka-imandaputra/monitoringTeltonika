import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

function parseIOData(ioData) {
    const ioDataObject = {};
    
    const keyValuePairs = ioData.split(',');
  
    keyValuePairs.forEach(pair => {
        const [key, ...value] = pair.split(':');
        ioDataObject[key.trim()] = value.join(':').trim();
    });
  
    return ioDataObject;
  };

export const teltonikaEndpointToDB =  async(req, res) => {
    const imei = req.body.imei;
    const jsonCodec = req.body.codec_data;
    const codecData = JSON.parse(jsonCodec);
    const io = req.body.io_data;
    const ioDataObject = parseIOData(io);
    
    const finalTemperature = parseFloat(ioDataObject['Dallas Temperature 1'].replace("°C", ""))
    //  console.log(codecData.data[0].lat)
    // console.log(codecData.data[0].lng, codecData.data[0].lat, finalTemperature, ioDataObject['Digital Input 2'], imei);
    // console.log(ioDataObject);
    // console.log();
    // console.log( codecData);
    console.log(
        [codecData.data[0].lng, codecData.data[0].lat, finalTemperature, ioDataObject['Digital Input 2'], imei]
      )
  
    try{
      const result = await pool.query(`
        UPDATE alat SET
          latitude = $1,
          longitude = $2,
          suhu = $3,
          digitalinput = $4
          where imei = $5
        RETURNING
          latitude,
          longitude,
          suhu,
          digitalinput;
          `,
        [codecData.data[0].lng,
         codecData.data[0].lat,
         finalTemperature,
         ioDataObject['Digital Input 2'],
         imei]
      )
      res.status(201).json(result.rows[0]);
  
    } catch(error){
      console.error("teltonika fail");
      res.status(500).send("teltonika DB fail");
    }
  };

