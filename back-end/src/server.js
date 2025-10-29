import express from 'express';
import { MongoClient, ReturnDocument, ServerApiVersion } from 'mongodb';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});


const app = express();

app.use(express.json());

let db;

async function connectToDB() {
    const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.9lxrix2.mongodb.net/?appName=Cluster0`;

    const client = new MongoClient(uri, {
        ssl: true,
        tlsAllowInvalidCertificates: false,
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();

    db = client.db('full-stack-react-db');
}

// app.get('/hello', function (req, res) {
//     res.send('Hello this is test for GET endpoint!');
// });

// app.get('/hello/:name', function (req, res) {
//     res.send('Hello, ' + req.params.name);
// });

// app.post('/hello', function (req, res) {
//    res.send('Hello, '+ req.body.name + ' from the POST endpoint!')
// });

app.use(express.static(path.join(__dirname, '../dist')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const article = await db.collection('articles').findOne({ name });

    res.json(article);
});

app.use(async function (req, res, next) {
    const { authtoken } = req.headers;

    if (authtoken) {
        const user = await admin.auth().verifyIdToken(authtoken);
        req.user = user;
        next();
    } else {
        res.sendStatus(400);
    }
});

app.post('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });
    
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
        const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { name },
        {
            $inc: { upvotes: 1 },
            $push: { upvoteIds: uid },
        },
        { returnDocument: "after" }
        );
    res.json(updatedArticle);
        
    } else {
        res.sendStatus(403); // User is not authorized to action
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    const newComment = { postedBy, text };

    const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { name },
        { $push: { comments: newComment } },
        { returnDocument: 'after' }
    );

    res.json(updatedArticle);
});

const PORT = process.env.PORT || 8000;

async function start() {
    await connectToDB();   
    app.listen(PORT, function () {
        console.log('Server is listening on port ' + PORT);
    });
}

start();