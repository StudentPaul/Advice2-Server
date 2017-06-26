/**
 * Created by socio on 12/24/2016.
 */
var app = require('../app');

app.set('port', 3000);

var server = app.listen(app.get('port'),function () {
  console.log('server started on port ' + server.address().port);
});