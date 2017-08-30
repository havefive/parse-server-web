import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import { Table,DatePicker, message,Icon,Modal,Button,Column,ColumnGroup,Form, Input,Radio} from 'antd';

import axios from 'axios';
axios.defaults.headers.common['X-Parse-Application-Id'] = 'crmAppId';


const confirm = Modal.confirm;
const FormItem = Form.Item;
const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form,isNew} = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title={isNew==true?"新增":"编辑"}
        okText={isNew==true?"提交":"保存"}
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="姓名">
            {getFieldDecorator('playerName', {
              rules: [{ required: true, message: 'Please input the title of collection!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="得分">
            {getFieldDecorator('score')(<Input type="number" />)}
          </FormItem>
          <FormItem label="objectId" style={{display:"none"}}>
            {getFieldDecorator('objectId')(<Input type="text" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      dataSource:[],
      visible:false,
      isNew:true
    };
  }
  edit(record){
    this.setState({
      isNew:false,
      visible:true
    })
    this.form.setFieldsValue({score:record.score,playerName:record.playerName,objectId:record.objectId})
  }
  handleDelete(objectId){
    var that = this;
    confirm({
      title: '确定删除吗？',
      content: '',
      onOk() {
        axios.delete('http://localhost:1357/parse/classes/GameScore/' + objectId)
            .then(function(response) {
              message.success('删除成功');
              that.componentDidMount();
            })
            .catch(function(error) {
              message.error('删除失败');

              console.log(error);
            });
      },
      onCancel() {},
    });
  }
  componentDidMount() {
    var that = this;
    axios.get('http://localhost:1357/parse/classes/GameScore')
      .then(function(response) {
        const tableData = [];
        for (var i = 0; i < response.data.results.length; i++) {
          tableData.push(response.data.results[i]);
        }
        that.setState({
          dataSource: tableData
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  handleChange(date) {
    message.info('您选择的日期是: ' + date.toString());
    this.setState({ date });
  }
  handleCancel(){
    this.setState({
      visible:false
    })
  }
  handleNew(){
    this.setState({
      visible:true,
      isNew: true
    })
    this.form.setFieldsValue({score:'',playerName:''})
  }
  handleCreate(){
    let that = this;
    const form = this.form;
    if(this.state.isNew){
      axios.post('http://localhost:1357/parse/classes/GameScore', { "score": parseInt(form.getFieldValue('score')), "playerName": form.getFieldValue('playerName'), "cheatMode": false })
      .then(function(response) {
        that.componentDidMount();
        that.setState({
          visible:false
        })
      })
      .catch(function(error) {
        console.log(error);
      });
    }else{
      axios.put('http://localhost:1357/parse/classes/GameScore/'+form.getFieldValue('objectId'), { "score": parseInt(form.getFieldValue('score')), "playerName": form.getFieldValue('playerName'), "cheatMode": false })
      .then(function(response) {
        that.componentDidMount();
        that.setState({
          visible:false
        })
      })
      .catch(function(error) {
        console.log(error);
      });
    }
    
  }

  saveFormRef(form){
    this.form = form;
  }

  render() {
    return (
      <div style={{ width: 800, margin: '100px auto' }}>
        <Button type="primary" onClick={this.handleNew.bind(this)}>新增</Button>
        <Table dataSource={this.state.dataSource}  rowKey="objectId">
          <Column
            title="姓名"
            dataIndex="playerName"
            key="playerName"
          />
          <Column
            title="得分"
            dataIndex="score"
            key="score"
          />
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
                  <span>
            <a href="javascript:;" onClick={this.edit.bind(this,record)}>编辑</a>
            <span className="ant-divider" />
            <a href="#" onClick={this.handleDelete.bind(this,record.objectId)}>删除</a>
          </span>
            )}
          />
        </Table>
        <CollectionCreateForm
          ref={this.saveFormRef.bind(this)}
          isNew = {this.state.isNew}
          visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)}
          onCreate={this.handleCreate.bind(this)}
        />
        <DatePicker onChange={value => this.handleChange(value)} />
        <div style={{ marginTop: 20 }}>当前日期：{this.state.date}</div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));