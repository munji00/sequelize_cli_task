const { createClient } =  require('redis')

const client = createClient();

const redisConnection = async() => {
    try {
        await client.connect();
        console.log('redis server connected succesfully')
    } catch (error:any)
     {
        console.log('error occured in redis' , error.message)
    }
}

module.exports = {
    client,
    redisConnection
}

