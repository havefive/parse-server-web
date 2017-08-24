import '../css/style.css';
import axios from 'axios';
axios.defaults.headers.common['X-Parse-Application-Id'] = 'crmAppId';

let tableData = [];

new Vue({
  el: '#app',

  mounted: function() {
    var that = this;
    that.loading = true;
    axios.get('http://localhost:1357/parse/classes/GameScore')
      .then(function(response) {
        for (var i = 0; i < response.data.results.length; i++) {
          tableData.push(response.data.results[i]);
        }
        that.loading = false;
      })
      .catch(function(error) {
        that.loading = false;
      });
  },
  data: function() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      editShow: false,
      tableData: tableData,
      loading: true,
      ruleForm2: {
        name: '',
        score: ''
      },
      rules2: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    refreshData: function() {
      var that = this;
      that.loading = true;
      axios.get('http://localhost:1357/parse/classes/GameScore')
        .then(function(response) {
          var tableData = [];
          for (var i = 0; i < response.data.results.length; i++) {
            tableData.push(response.data.results[i]);
          }
          that.tableData = tableData;
          that.loading = false;
        })
        .catch(function(error) {
          that.loading = false;
        });
    },
    handleDelete: function(index, row) {
      var that = this;
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('http://localhost:1357/parse/classes/GameScore/' + row.objectId)
          .then(function(response) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.refreshData();
          })
          .catch(function(error) {
            console.log(error);
          });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    showAdd: function() {
      this.visible = true;
    },
    showEdit: function(index, row) {
      this.editShow = true;
      this.ruleForm2.name = row.playerName;
      this.ruleForm2.score = row.score;
      this.ruleForm2.objectId = row.objectId;
    },
    addData() {
      let that = this;
      this.$refs.ruleForm2.validate(function(valid) {
        if (valid) {
          axios.post('http://localhost:1357/parse/classes/GameScore', { "score": parseInt(that.ruleForm2.score), "playerName": that.ruleForm2.name, "cheatMode": false })
            .then(function(response) {
              that.visible = false;
              that.refreshData();
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {

          return false;
        }
      });
    },
    editData: function(objectId) {
      let that = this;  
      this.$refs.ruleForm2.validate(function(valid) {
        if (valid) {
          axios.put('http://localhost:1357/parse/classes/GameScore/' + objectId, { "score": parseInt(that.ruleForm2.score), "playerName": that.ruleForm2.name, "cheatMode": false })
            .then(function(response) {
              that.editShow = false;
              that.refreshData();
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    }
  }
})
