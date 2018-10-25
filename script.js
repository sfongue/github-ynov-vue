function loadJSON(filePath) {
  // Load json file;
  var json = loadTextFileAjaxSync(filePath, "application/json");
  // Parse json
  return JSON.parse(json);
}

// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    return xmlhttp.responseText;
  } else {
    return null;
  }
}

var config = loadJSON("config.json");

// Create an array of users
var listUsers = [];
config.users.forEach(user => {
  listUsers.push(user);
  // console.log(user);
})
// console.log(listUsers);

const app = new Vue({
  el: '#app',
  data: {
    results: [],
    users: [],
    selectedUser: '',
  },
  methods: {
    getProjectsUsers(user) {
      // Create a request variable and assign a new XMLHttpRequest object to it.
      var request = new XMLHttpRequest();

      var results = [];
      // console.log('https://api.github.com/users/'+user+'/repos');
      request.open('GET', 'https://api.github.com/users/' + user, true);
      request.setRequestHeader("Authorization", "token " + config.token);

      request.onload = function () {
        var data = JSON.parse(this.response);
        console.log(data);
        if (request.status >= 200 && request.status < 400) {
          data.forEach(repos => {
            results.push(
              { 
                "name" : repos.name, 
                "user" : repos.owner.login, 
                "url" : repos.html_url 
              }
            );
            console.log(results);
          });
        } else {
          console.log(error);
        }
      }
      // Send request
      request.send();
      console.log(results)
    },
    getCommits(repo) {

    }
  },
  mounted() {
    this.users = listUsers
  }
}
)

