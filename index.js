const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51PErhSBJFo0Nfv3hADOpBRd4m8AkGocT45weyaQaqOnvwAbE6LecGIyN8uMqyBneJPtIocolgjyWJyiR1OzAiQo500Ho6ecb35');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

//handlebar middleware
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// set the static folder
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/create-checkout-session', async (req, res) => {
    const amount = 250;
    
    try {
        const customer = await stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
        });
        const charges = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            customer: customer.id,
            description: 'An ebook for you',
        });
       
        res.render('success');
        
       /*  console.log(customer.id);
        res.status(200).json({ customerId: customer.id }); // Optionally, you can send the customer ID back in the response */
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the customer.' });
    }
});

app.get('/success', (req, res) => {
    res.render('You will Receive Ebook in one business day')
})
app.get('/cancel', (req, res) => {
    res.render('You will not receive Ebook, because something went wrong')
})
app.get
/* stripe.customers.create({
email: 'customer@example.com',
})
.then(customer => console.log(customer.id))
.catch(error => console.error(error));
 */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); //...
})