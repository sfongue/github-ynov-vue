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
})

// Create an array of projects
var listProjects = [];
config.projects.forEach(project => {
  listProjects.push(project);
})

var listCommits = [];

const app = new Vue({
  el: '#app',
  data: {
    results: [],
    users: [],
    projects: [],
    commits: null,
    selectedUser: '',
    selectedProject: '',
    dateSince: '',
    dateUntil: '',
    isDisplay: false
  },
  methods: {
    getProject() {
      // Create a request variable and assign a new XMLHttpRequest object to it.
      var request = new XMLHttpRequest();

      var results = [];
      
      // console.log('https://api.github.com/repos/' + this.selectedUser + '/' + this.selectedProject, true);
      request.open('GET', 'https://api.github.com/repos/' + this.selectedUser + "/" + this.selectedProject, true);
      request.setRequestHeader("Authorization", "token " + config.token);

      request.onload = function () {
        var dataUser = JSON.parse(this.response);
        // console.log(dataUser);
        if (request.status >= 200 && request.status < 400) {
          results.push(
            { 
              "name" : dataUser.name,
              "html_url" : dataUser.html_url,
              "url" : dataUser.url
            }
          );
        } else {
          console.log(error);
        }
      }
      // Send request
      request.send();
      this.getCommits();
    },
    // Function to get all the commits on a project and return an array
    getCommits() {
      // Create a request variable and assign a new XMLHttpRequest object to it.
      var request = new XMLHttpRequest();

      // console.log('https://api.github.com/repos/' + this.selectedUser + '/' + this.selectedProject + "/commits", true);
      // request.open('GET', 'https://api.github.com/repos/sfongue/github-ynov-vue', true);
      // console.log('https://api.github.com/repos/' + this.selectedUser + "/" + this.selectedProject, true);
      request.open('GET', 'https://api.github.com/repos/' + this.selectedUser + "/" + this.selectedProject + "/commits?since=" + this.dateSince + "T00:00:00Z&until=" + this.dateUntil + "T23:59:59Z", true);
      request.setRequestHeader("Authorization", "token " + config.token);

      request.onload = function () {
        var dataCommits = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
          dataCommits.forEach(aCommit => {
            listCommits.push(
              { 
                "author": aCommit.commit.committer.name,
                "date": aCommit.commit.committer.date,
                "message": aCommit.commit.message
              } 
            );
          })
        } else {
          console.log(error);
        }
      }
      // Send request
      request.send();
      console.log("list :" ,listCommits);
      this.show();
    },
    show() {
      this.isDisplay = true;
    }
  },
  mounted() {
    this.users = listUsers,
    this.projects = listProjects,
    this.commits = listCommits
  },
}
)