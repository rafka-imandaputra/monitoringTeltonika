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

    const options = {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false  
    };

    const timestampInMS = codecData.data[0].timestampMs;
    const date  = new Date(timestampInMS);
    const dateWithoutTimeStamp = date.toLocaleDateString('en-ID', options);


    const finalTemperature = parseFloat(ioDataObject['Dallas Temperature 1'].replace("°C", ""))
    //  console.log(codecData.data[0].lat)
    // console.log(codecData.data[0].lng, codecData.data[0].lat, finalTemperature, ioDataObject['Digital Input 2'], imei);
    // console.log(ioDataObject);
    // console.log();
    // console.log( codecData);
    console.log(
        [codecData.data[0].lng, dateWithoutTimeStamp, codecData.data[0].lat, finalTemperature, ioDataObject['Digital Input 2'], imei]
      )
  
    try{
      const result = await pool.query(`
        UPDATE alat SET
          latitude = $1,
          longitude = $2,
          suhu = $3,
          digitalinput = $4,
          data_sent_timestamp = to_timestamp($5, 'DD/MM/YYYY, HH24.MI.SS')::timestamp
          where imei = $6
        RETURNING
          latitude,
          longitude,
          suhu,
          digitalinput,
          data_sent_timestamp;
          `,
        [codecData.data[0].lng,
         codecData.data[0].lat,
         finalTemperature,
         ioDataObject['Digital Input 2'],
         dateWithoutTimeStamp,
         imei]
      )
      res.status(201).json(result.rows[0]);
  
    } catch(error){
      console.error("teltonika fail");
      res.status(500).send("teltonika DB fail");
    }
  };

  // export const getNowPointBasedOnIMEI = async (req, res) => {
  //   try {
  //     const result = await pool.query(`

  //       `)
  //   }
  // }

  export const getDashboardPinpoints = async (req, res) => {
    try {
      const result = await pool.query(`
      select sewa.id_sewa, id_client, alat.imei, namaalat, latitude, longitude, suhu, namabarang from sewa 
      inner join alat on sewa.imei = alat.imei 
      inner join konfigurasi on konfigurasi.id_sewa = sewa.id_sewa
      inner join commodity on commodity.id_konfigurasi = konfigurasi.id_konfigurasi 
      `);
  
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching pinpoint data");
    }
  };

  
