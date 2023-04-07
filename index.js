const http = require('http');
const fs = require('fs');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const PORT = 8000;

//SERVER

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true}));

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    
    //Overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        //console.log(cardsHtml);
        const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);
        res.end(output);
    
    //Product page
    } else if(pathname === '/product') {
        res.writeHead(200, { 'Content-Type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        
    //API
    } else if(pathname === '/api') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(data);
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('Server is running on port: ', PORT);
})