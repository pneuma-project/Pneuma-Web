/*
 * @file Header组件
 * @Author: aflextyang
 * @Date:   2018-3-1 10:47:58
 * @Last Modified by:   aflextyang
 * @Last Modified time: 2018-3-1 10:48:01
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapActions, autoBind, } from '../../component/utils';
import { Dialog  } from '../../component';
import { Upload, Input, Select, Button, Message, Notification, Layout, Dropdown } from 'element-react';
import { Icon } from 'antd';
import liulanqi from '../../static/image/app_liulanqi.png';
import weishi from '../../static/image/app_weishi.png';
import kuaibao from '../../static/image/app_kuaibao.png';
import nowzhibo from '../../static/image/app_nowzhibo.png';
import 'isomorphic-fetch';

@connect(state => ({
    history: state.router.history,
    loading: state.glob.get('loading'),
    doLogouting: state.home.get('doLogouting'),
    location: state.router.location,
    appArray: state.glob.get('appData').toJS(),
    resetAppId: state.home.get('resetAppId'),
    appId: state.glob.get('appId'),
}))
@mapActions
@autoBind
class TopHeader extends React.Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        userInfo: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        // 权限相关
        this.auth = props.userInfo.auth || {};
        // 我的实验
        this.isExperimentPri = !!this.auth['experiment'];
        this.isManagePri = !!this.auth['manageCenter'];
        this.welfare = !!this.auth['welfare'];
        this.roleIdList = (props.userInfo.roleList || []).map(item => item.roleId) || [];
        this.textInput = null;
        this.setTextInputRef = element => {
          this.textInput = element;
        };
        this.upload = null;
        this.doMainUrl = window.pageConfig && window.pageConfig.info.doMainUrl || '';
        this.state = {
            imgList: [],
            doLogouting: false,
            dialogData: {
                showFooter: false,
                title: '',
                dialogVisible: true,
                closeDialog: this.closeDialogHandler,
                wrapperClsName: 'advice-feedback',
                size: "small"
            },    
            commentType: '',
            commentDesc: '',    
            commentOptions: [{
                value:  'commentType0',
                label: '大盘监控'
              }, {
                value: 'commentType1',
                label: '流转监控'
              }, {
                value: 'commentType2',
                label: '策略监控'
              }, {
                value: 'commentType6',
                label: '归因监控'
              },{
                value: 'commentType8',
                label: '北极星监控'
              },{
                value: 'commentType3',
                label: '我的人群'
              }, {
                value: 'commentType4',
                label: '洞察分析'
              }, {
                value: 'commentType7',
                label: '路径分析'
              },{
                value: 'commentType5',
                label: '增长实验'
              },]
        };
    }
    componentWillReceiveProps(nextProps) {
        return nextProps;
    }
    componentDidMount() {

    }
    onChange(key, value) {
      this.setState({
         [key]: value 
      });
    }
    
    handleSubmitComment() {
      const { actions } = this.props;
      const { currentPath } = this.state
      const { commentType, commentDesc, imgList } = this.state
      if(commentType && commentDesc){
        actions.addUserComment({
          commentType,
          commentDesc,
          sPicURL:JSON.stringify(imgList)
        }).then((res) => {
            if(res.code === 0){
            if(imgList.length > 0){
                this.upload.clearFiles()
            }
              Message({
                type: 'success',
                message: '提交反馈成功' 
              });
              this.setState({
                //  commentDesc:'',
                 commentType:'ssss'
              });
              if(currentPath === '/feedback') {
                actions.push('/feedback');
                }    
            }
          
            this.closeDialogHandler()  
        }).catch((err) => {
            Notification.error({
                title: '错误',
                message: `提交反馈出错，请重试`
            });
            console.error('提交反馈 error', err);
        });
      } else {
        Notification.error({
          title: '错误',
          message: `请选择反馈类型并且描述详情！`
        });
      }
    }

    handleRemove(file, fileList) {
        const { imgList } = this.state; 
        imgList.splice(imgList.map(el => el.url).indexOf(file.name), 1);     
    }
   
    getImgUrl(data) {
        const { actions } = this.props
        const { size, name, } = data.file ;
        actions.getImg({
            filename: name,
            filesize:size,
            file:data.file
        }).then(res => {
            const { cdn_url, ret_code, err_msg } = res.data;
            const { imgList } = this.state;
            if(ret_code === 200 && err_msg === '') {
                data.onSuccess()
                var img = new Image();
                img.src =  cdn_url;
                const self = this;
                img.onload = function(){
                    // 获取图片原始宽高
                    let newFile =  {url: cdn_url,status: "success",w:img.width,h:img.height}
                    imgList.push(newFile)
                    self.setState({
                        imgList
                    })
                    Notification({
                        title: '成功',
                        message: '图片上传成功',
                        type: 'success'
                    });
                };
               
        
            } else {
                Notification.error({
                    title: '上传失败',
                    message: `图片名只能由字母数字下划线组成,请重新上传`
                });
            }
        })
    }
 
    showFoundHandler() {
        this.dialogBody = (
        <ul className="comment-wrap">
            <li className="select">
            <span>1.选择反馈类型：</span>
            <Select placeholder="请选择问题类型" onChange={this.onChange.bind(this,'commentType')} value={this.state.commentType}>
                {this.state.commentOptions.map(item => (
                    <Select.Option label={item.label} value={item.value} key={item.value}></Select.Option>
                ))}
            </Select>
            </li>
            <li className="upload" >
            <span>2.</span>
            <Upload
                className="upload-demo"
                ref={(c) => this.upload = c}
                action={`/api/uploadImg`}
                httpRequest={this.getImgUrl}
                onRemove={(file, fileList) => this.handleRemove(file, fileList)}
                // onSuccess={(response, file, fileList) => this.handleUploadSuccess(response, file, fileList)}
                multiple={true}
                listType="picture"
                tip={<div className="el-upload__tip">只能上传jpg/png文件，图片名只能由字母数字下划线组成</div>}
            >
            <Button size="small" type="primary">上传图片</Button>
            </Upload>
            </li> 
            <li className='desc-wrap'>
            <span className="title">2.详情描述：</span>
            <Input
                type="textarea" 
                autosize={{ minRows: 8}}
                // value={this.state.commentDesc}
                onChange={(value) => this.onChange('commentDesc',value)}
            />
            </li>
        </ul>
      );
      this.showDialogHandler("意见反馈"); 
    }

    showDialogHandler(title) {
        const { dialogData } = this.state;
        this.setState({
            dialogData: Object.assign({}, dialogData, {
                title,
                dialogVisible: true
            })
        });
    }

    closeDialogHandler() {
        const { dialogData } = this.state;
        this.setState({
            dialogData: Object.assign({}, dialogData, {
                dialogVisible: false
            })
        }, () => {
            this.dialogBody = null;
        });
    }
    getDialogBlock() {
      const {
          dialogData
      } = this.state;
      const { dialogBody } = this;
      if (!dialogBody) {
          return null;
      }
      return (
        <Dialog data={dialogData}>
          {dialogBody}
          <div className="button-wrap">
            <a
                className="feedback-process"
                target="_blank"
                href="https://docs.qq.com/sheet/DWGlTZ25EQlNLQnl2?opendocxfrom=admin&tab=BB08J2"
                onClick={this.closeDialogHandler}
             >历史进展</a>
            <div>
            <Button type="primary" onClick={this.handleSubmitComment}>提交反馈</Button>
            <Button  onClick={this.closeDialogHandler}>取 消</Button>
            </div>
          </div> 
        </Dialog>
      );
    }
    getCurrentPath(props) {
        const { location } = props || window;
        const { headerLinkList } = this.state;
        headerLinkList.some((item) => {
            if (item.children) {
                item.children.some((childItem) => {
                    if (location.pathname.indexOf(childItem.path) === 0) {
                        this.setState({
                            currentPath: childItem.path
                        });
                        return true;
                    }
                    return false;
                });
            }
            if (location.pathname.indexOf(item.path) === 0) {
                this.setState({
                    currentPath: item.path
                });
                return true;
            }
            return false;
        });
    }

    getRedirectBlock() {
        const { userInfo: { logined, isWhite } } = this.props;
        const { location } = window;
        if (location.pathname !== '/' && (!logined || !isWhite)) {
            return (
                <Redirect to={{ pathname: '/' }} />
            );
        }
        if (logined) {
            if (location.pathname === '/') {
                return <Redirect to={{ pathname: '/audience' }} />;
            }
        }
    }
   
    appChangeHandler(appId) {
        const { actions } = this.props 
        localStorage.setItem('appId', appId)
        // actions.resetAppId(appId)
        actions.go(0)
    }
    getHeaderBlock() {
        const {
            userInfo: {
                isWhite, logined, isRoleValid, account, logoutUrl, 
            },
            appArray,
        } = this.props;
        let appName;
        let appId = localStorage.getItem('appId');
        let appImg;
        // console.log(appArray,'------>appArray')
        appArray.forEach(item => {
            if(item.id ===  appId) {
                appName = item.name
            }
        })
        switch (appId ? appId : 'mqq') {
            case 'mqq':
                appImg = liulanqi;
                break;
            case 'kuaibao':
                appImg = kuaibao;
                break;
            case 'weishi':
                appImg = weishi;
                break;
            case 'now':
                appImg = nowzhibo;
            default:
                break;
        }
        

        const avatarUrl = `http://r.hrc.oa.com/photo/48/${account}.png`;
        const unAuthBlock = isRoleValid ? null : <span className="fl" style={{position: "relative", top: "15px"}}>没有角色权限</span>;
        if (!logined) {
            return (
                <div className="photo fr">
                    {(account && isRoleValid) && (
                        <img src={avatarUrl} alt="pic" />
                    )
                    }
                    <span className="no-name fr">
                        {`${(!account) ? `没有权限` : account}`}
                    </span>
                    {account && <a className="logout fl" href={logoutUrl} >[退出]</a>}
                </div>
            );
        }
        return (
            <div className="photo fr">
                <Dropdown style={{float: 'left'}}  trigger="click" onCommand={this.appChangeHandler} menu={(
                    <Dropdown.Menu>
                        {appArray.length > 0 && appArray.map(item => (
                        <Dropdown.Item key={item.id} command={item.id}>{item.name}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                )}
                >
                    <span className="el-dropdown-link">
                    <img src={appImg} alt="pic" className="app_img" />
                    <span  className='app_name'>{ appName ? appName : '手机浏览器' }</span>
                    <i className="el-icon-caret-bottom el-icon--right icon_caret" ></i>
                    </span>
                </Dropdown>
                <Icon
                    className="feedback"
                    type="form"
                    onClick={() => {
                        this.showFoundHandler();
                    }}
                />
                {(account && isRoleValid) && (
                    <img src={avatarUrl} alt="pic" className="avatar_img"/>
                    )
                }
                 <Dropdown
                    className="login-user"
                    menu={(
                    <Dropdown.Menu>
                        <Dropdown.Item>{account && <a href={logoutUrl} >退出</a>}</Dropdown.Item>
                    </Dropdown.Menu>
                )}>
                    <span className="name el-dropdown-link fr">
                        {`${(!account) ? `未登录` : account}`}
                    </span>
                </Dropdown>
            </div>
        );
            
    }
    menuOnClickHandler(pathname) {
        this.getCurrentPath({
            location: {
                pathname
            }
        });
    }
    render() {
        const headerBlock = this.getHeaderBlock();
        const dialogBlock = this.getDialogBlock();
        return (
            <div className="mod-header clearfix">
                {headerBlock}
                {dialogBlock}
            </div>
        );
    }
}

export default TopHeader;