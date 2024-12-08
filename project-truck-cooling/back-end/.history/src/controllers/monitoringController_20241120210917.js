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
      const { id_sewa } = req.params;

      const result = await pool.query(`
          select a.namaalat, a.suhu, a.latitude, a.longitude, a.data_sent_timestamp, k.id_konfigurasi, STRING_AGG(commodity.namabarang, ', ') as namabarang
          from alat as a inner join sewa as s on a.imei = s.imei inner join konfigurasi as k on s.id_sewa = k.id_sewa
          inner join commodity on k.id_konfigurasi = commodity.id_konfigurasi where s.id_sewa = $1
          GROUP BY a.namaalat, a.suhu, a.latitude, a.longitude, a.data_sent_timestamp, k.id_konfigurasi
      `, [id_sewa]);
  
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching pinpoint data");
    }
  };

  
