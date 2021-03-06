var React = require('react');
var ReactRouter = require('react-router');
var Link = require('react-router').Link;
var ModalContainer = require('../containers/ModalContainer');

function PostRow (props) {
  return (
    <tr id={props.postToPostRowComp.id}>
      <td>{props.postToPostRowComp.id}</td>
      <td>{props.postToPostRowComp.title}</td>
      <td>{props.postToPostRowComp.createdAt}</td>
      <td>{props.postToPostRowComp.modifiedAt}</td>
      <td>
        <Link to={`/posts/${props.postToPostRowComp.id}`}><button type="button" className="btn btn-default">Show</button></Link>
        <button type="button" className="btn btn-default" onClick={props.editButtonToPostRowComp}>Edit</button>
        <button type="button" className="btn btn-default" onClick={props.deleteButtonToPostRowComp}>Delete</button>
      </td>
    </tr>
  )
}

module.exports = PostRow;
