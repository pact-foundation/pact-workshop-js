const app = require('express')();
const cors = require('cors');
const routes = require('./product/product.routes');
const authMiddleware = require('./middleware/auth.middleware');
const port = 8081;

const init = () => {
    app.use(cors());
    app.use(routes);
    app.use(authMiddleware);
    return app.listen(port, () => console.log(`Provider API listening on port ${port}...`));
};

init();