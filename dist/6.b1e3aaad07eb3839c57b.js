(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{218:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),c=a(5),l=a(15),r=a(3),o=a(2),u=a.n(o),i=a(10),m=a(107),d=a.n(m),f=a(19),p=a(17),E=a(9),b=a(13);t.default=function(){const e=Object(n.useContext)(E.a),t=Object(n.useContext)(b.a),{id:a}=Object(l.g)(),[o,m]=Object(n.useState)(!0),[g,w]=Object(n.useState)(),[h,y]=Object(n.useState)(0),[k,N]=Object(n.useState)(!1);if(Object(n.useEffect)(()=>{const e=u.a.CancelToken.source();return async function(){try{const t=await u.a.get("/post/"+a,{cancelToken:e.token});w(t.data),m(!1)}catch(e){console.log("Problem from viewSinglePost page.")}}(),()=>{e.cancel()}},[a]),Object(n.useEffect)(()=>{if(h){const t=u.a.CancelToken.source();return async function(){try{"Success"==(await u.a.delete("/post/"+a,{data:{token:e.user.token}},{cancelToken:t.token})).data&&N(!0)}catch(e){console.log("Problem from viewSinglePost page.")}}(),()=>{t.cancel()}}},[h]),k)return t({type:"flashMessage",value:"Post was successfully deleted."}),s.a.createElement(l.a,{to:"/profile/"+e.user.username});if(!o&&!g)return s.a.createElement(p.a,null);if(o)return s.a.createElement(c.a,{title:"..."},s.a.createElement(i.a,null));const j=new Date(g.createdDate),O=`${j.getMonth()+1}/${j.getDate()}/${j.getFullYear()}`;return s.a.createElement(c.a,{title:g.title},s.a.createElement("div",{className:"d-flex justify-content-between"},s.a.createElement("h2",null,g.title),!!e.loggedIn&&e.user.username==g.author.username&&s.a.createElement("span",{className:"pt-2"},s.a.createElement(r.b,{to:`/post/${g._id}/edit`,"data-tip":"Edit","data-for":"edit",className:"text-primary mr-2"},s.a.createElement("i",{className:"fas fa-edit"})),s.a.createElement(f.a,{id:"edit",className:"custom-tooltip"})," ",s.a.createElement("a",{onClick:function(){window.confirm("Are you sure?")&&y(e=>e+1)},"data-tip":"Delete","data-for":"delete",className:"delete-post-button text-danger"},s.a.createElement("i",{className:"fas fa-trash"})),s.a.createElement(f.a,{id:"delete",className:"custom-tooltip"}))),s.a.createElement("p",{className:"text-muted small mb-4"},s.a.createElement(r.b,{to:"/profile/"+g.author.username},s.a.createElement("img",{className:"avatar-tiny",src:g.author.avatar})),"Posted by ",s.a.createElement(r.b,{to:"/profile/"+g.author.username},g.author.username)," ",O),s.a.createElement("div",{className:"body-content"},s.a.createElement(d.a,{source:g.body,allowedTypes:["paragraph","strong","emphasis","text","heading","list","listItem"]})))}}}]);