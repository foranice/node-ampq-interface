const express = require('express');
const app = express();
const amqp = require('amqplib');
//const Buffer=require('buffer')
//首先我们需要通过amqp连接本地的rabbitmq服务，返回一个promise对象
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/json
app.post('/add', async function (req, res) {
    let check=ch.checkQueue('spider')
    console.log(req.body.message)
    let send=await ch.sendToQueue('spider',Buffer.from(req.body.message,'utf8'));
    res.send(send);
});
app.get('/get', async function (req, res) {
    let check=await ch.checkQueue('spider')
    let msg
    let msgs=[]
    while(msg=await ch.get('spider')){
        if(msg.content){
            console.log(msg.content)
            let content= msg.content.toString('utf8')
            console.log(content)
            msgs.push(content)
        }
    }
    res.send(msgs);
});
app.get('/recover',async function (req,res) {
    let re=ch.recover()
    res.send(re)
})
async function start() {
    let connect=await amqp.connect({
        protocol: 'amqp',
        hostname: '139.129.240.12',
        port: 5672,
        username: 'meimiao',
        password: 'meimiao1905',
        locale: 'zh_cn',
        frameMax: 0,
        heartbeat: 0,
        vhost: '/',
    })
    process.once('SIGN',function(){
        connect.close()
    });

    ch=await connect.createChannel()
    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });
}
start()