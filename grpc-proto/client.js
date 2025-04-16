const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/helloworld.proto';

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const helloworld_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
    const client = new helloworld_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
    const user = process.argv.length > 2 ? process.argv[2] : 'świat';

    client.SayHello({ name: user }, (err, response) => {
        if (err) {
            console.error('Błąd:', err);
            return;
        }
        console.log('Powitanie:', response.message);
    });
}

main();