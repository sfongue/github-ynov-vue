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
var listReadme = [];
var listData = [];

const app = new Vue({
  el: '#app',
  data: {
    users: [],
    projects: [],
    info: [],
    selectedUser: '',
    checkedUsers: [],
    selectedProject: '',
    dateSince: '',
    dateUntil: '',
    isDisplay: false
  },
  methods: {
    getData() {
      // Create a request variable and assign a new XMLHttpRequest object to it.
      this.checkedUsers.forEach(user => {
        this.getCommits(user);
        this.getReadme(user, this.selectedProject);
        listData = [];
        listData.push(
          {
            "author": user,
            "commits": listCommits,
            "readme": listReadme
          })
        this.info.push(listData);
        }
      );
      

    },
    // Function to get all the commits on a project and return an array
    getCommits(username) {
      // Create a request variable and assign a new XMLHttpRequest object to it.
      var request = new XMLHttpRequest();
      request.open('GET', 'https://api.github.com/repos/' + username + "/" + this.selectedProject + "/commits?since=" + this.dateSince + "T00:00:00Z&until=" + this.dateUntil + "T23:59:59Z", true);
      request.setRequestHeader("Authorization", "token " + config.token);
      listCommits = [];
      request.onload = function () {
        if (request.status >= 200) {
          var dataCommits = JSON.parse(this.response);
          console.log(JSON.parse(this.response))
          dataCommits.forEach(aCommit => {
            listCommits.push(
              { 
                "author": aCommit.commit.author.name,
                "date": aCommit.commit.author.date,
                "message": aCommit.commit.message
              }
            );
          })
        } else {
          console.log(error);
        }
      }
      // Send request
      console.log("commit:", listCommits)
      request.send();
      
      this.isDisplay = true;
    },
    getReadme(username, repo) {
      var request = new XMLHttpRequest();
      request.open('GET', 'https://api.github.com/repos/' + username + "/" + repo + "/readme", false);    
      request.setRequestHeader("Authorization", "token " + config.token);
      listReadme = [];
      request.onload = function () {
        var dataReadme = JSON.parse(this.response);
        
        if (request.status >= 200) {
          listReadme.push(
            { 
              "author" : username,
              "html_url" : dataReadme.html_url,
            }
          );
        } else {
          console.log(error);
        }
      }
      // Send request
      request.send();
    }
  },
  mounted() {
    this.users = listUsers,
    this.projects = listProjects
  },
}
)