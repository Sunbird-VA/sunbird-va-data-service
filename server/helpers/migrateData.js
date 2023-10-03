import config from '../../config/config';

const { Client } = require('pg');

// Database connection configuration
const dbConfig = {
    user: config.telemetry.user,
    host: config.telemetry.host,
    database: config.telemetry.db,
    password: config.telemetry.passwd,
    port: 5432, // Default PostgreSQL port
};

// SQL query to fetch data from the table
const query = {
    text: config.IS_MIGRATED ? "SELECT level, message, meta, timestamp FROM public.winston_logs WHERE timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' >= NOW() - INTERVAL '5 minutes' order by timestamp desc" : "SELECT level, message, meta, timestamp FROM public.winston_logs"
}

const getData = () => {
    // Create a new PostgreSQL client
    const client = new Client(dbConfig);

    // Connect to the PostgreSQL database
    client.connect()
        .then(() => {
            console.log('Connected to the database');
            // Fetch data from the table
            return client.query(query);
        })
        .then(async (result) => {
            // Process the JSON data and create rows for CSV
            if (result.rows && result.rows.length > 0) {

                for (const row of result.rows) {
                    const { message, converted_timestamp, meta } = row;
                    let data = JSON.parse(message);
                    //console.log(data);
                    let qObject = ""
                    for (const item of data['events']) {
                        if (item['eid'] == "OE_ITEM_RESPONSE") {

                            qObject = item['edata']['eks']['target']['questionsDetails'];
                            if (qObject && qObject['questionText']) {
                                const questionDate = new Date(item['ets']).toISOString();
                                await create('discussion_details', client,
                                    { 'question_text': qObject['questionText'], "answer_text": qObject['anserText'], 'user_id': meta.mid, 'uid': item['uid'], 'sid': item['sid'], created_at: questionDate }
                                );
                            }
                        }
                    }

                    // console.log("ques", qObject)
                    // await create('discussion_details', qObject);
                }
            }
        })
        .then(() => {
            console.log('migrated successfully');
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            // Close the database connection
            // client.end();
        });
}

const getListOfQA = async() => {
    const client = new Client(dbConfig);
    return client.connect()
    .then(() => {
        console.log('Connected to the database');
        return client.query("SELECT * from discussion_details");
    })
    .then(async (result) => {
        // Process the JSON data and create rows for CSV
        if (result.rows && result.rows.length > 0) {
            return result.rows;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return []
    })
    .finally(() => {
        client.end();
    });

}

const create = async (tableName, client, rest) => {
    try {
        let query = insertQuery({
            table: tableName,
            data: rest,
            returnfields: "*",
        });
        let columnvalues = getQueryValues(rest);
        const { rows } = await client.query(query, [...columnvalues]);
        return rows;
    } catch (err) {
        console.log("error", err)
    }
}

const getQueryValues = (data) => {
    var colValues = Object.keys(data).map(function (key) {
        return data[key];
    });
    let existcol = colValues.filter(function (val) {
        return true;
    })
    var merged = [].concat.apply([], existcol);
    return merged;

}


const insertQuery = (builder) => {
    // Setup static beginning of query
    const { table, data, returnfields } = builder;
    var query = ['INSERT INTO ' + table + '('];
    var fields = [];
    Object.keys(data).forEach(function (key, i) {
        fields.push(key);
    });
    query.push(fields.join(', '));
    query.push(")");
    // Create another array storing each set command
    // and assigning a number value for parameterized query
    query.push("VALUES (");
    var set = [];
    Object.keys(data).forEach(function (key, i) {
        set.push(' $' + (i + 1));
    });
    query.push(set.join(', '));
    query.push(')' + 'RETURNING ' + returnfields);
    // Return a complete query string
    return query.join(' ');
}


export default { getData, getListOfQA }
