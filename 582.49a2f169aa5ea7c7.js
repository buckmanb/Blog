"use strict";(self.webpackChunkblog_app=self.webpackChunkblog_app||[]).push([[582],{3582:(G,m,a)=>{a.r(m),a.d(m,{UserPostsComponent:()=>W});var _=a(3014),t=a(3107),E=a(4460),P=a(4892),r=a(5329),d=a(9471),g=a(3904),p=a(303),h=a(4032),C=a(3220),c=a(7818),f=a(1054),v=a(7859),b=a(4466);const F=n=>["/blog",n],k=n=>["/blog",n,"edit"],u=(n,i)=>i.id;function x(n,i){1&n&&(t.j41(0,"div",6),t.nrm(1,"mat-spinner",9),t.k0s())}function M(n,i){1&n&&(t.j41(0,"div",7)(1,"h2"),t.EFF(2,"No posts yet"),t.k0s(),t.j41(3,"p"),t.EFF(4,"Create your first post to get started!"),t.k0s(),t.j41(5,"a",3),t.EFF(6,"Create Post"),t.k0s()())}function j(n,i){if(1&n){const o=t.RV6();t.j41(0,"button",19),t.bIt("click",function(){t.eBV(o);const e=t.XpG().$implicit,l=t.XpG(2);return t.Njj(l.publishPost(e))}),t.j41(1,"mat-icon"),t.EFF(2,"publish"),t.k0s(),t.j41(3,"span"),t.EFF(4,"Publish"),t.k0s()()}}function D(n,i){if(1&n){const o=t.RV6();t.j41(0,"button",19),t.bIt("click",function(){t.eBV(o);const e=t.XpG().$implicit,l=t.XpG(2);return t.Njj(l.unpublishPost(e))}),t.j41(1,"mat-icon"),t.EFF(2,"unpublished"),t.k0s(),t.j41(3,"span"),t.EFF(4,"Unpublish"),t.k0s()()}}function R(n,i){if(1&n){const o=t.RV6();t.j41(0,"div",10)(1,"mat-card")(2,"mat-card-header")(3,"mat-card-title"),t.EFF(4),t.k0s(),t.j41(5,"mat-card-subtitle")(6,"div",11)(7,"mat-chip",12),t.EFF(8),t.k0s()(),t.j41(9,"span",13),t.EFF(10),t.k0s()()(),t.j41(11,"mat-card-content")(12,"p",14),t.EFF(13),t.k0s()(),t.j41(14,"mat-card-actions")(15,"a",15)(16,"mat-icon"),t.EFF(17,"visibility"),t.k0s(),t.EFF(18," View "),t.k0s(),t.j41(19,"a",16)(20,"mat-icon"),t.EFF(21,"edit"),t.k0s(),t.EFF(22," Edit "),t.k0s(),t.j41(23,"button",17)(24,"mat-icon"),t.EFF(25,"more_vert"),t.k0s()(),t.j41(26,"mat-menu",null,0),t.DNE(28,j,5,0,"button",18)(29,D,5,0,"button",18),t.j41(30,"button",19),t.bIt("click",function(){const e=t.eBV(o).$implicit,l=t.XpG(2);return t.Njj(l.deletePost(e))}),t.j41(31,"mat-icon",20),t.EFF(32,"delete"),t.k0s(),t.j41(33,"span"),t.EFF(34,"Delete"),t.k0s()()()(),t.j41(35,"mat-card-footer")(36,"div",21)(37,"div",22)(38,"mat-icon"),t.EFF(39,"visibility"),t.k0s(),t.j41(40,"span"),t.EFF(41),t.k0s()(),t.j41(42,"div",22)(43,"mat-icon"),t.EFF(44,"favorite"),t.k0s(),t.j41(45,"span"),t.EFF(46),t.k0s()()()()()()}if(2&n){const o=i.$implicit,s=t.sdS(27),e=t.XpG(2);t.R7$(4),t.JRh(o.title),t.R7$(3),t.Y8G("color",e.getStatusColor(o.status)),t.R7$(),t.JRh(o.status),t.R7$(2),t.JRh(e.formatDate(o.updatedAt)),t.R7$(3),t.JRh(e.generateExcerpt(o)),t.R7$(2),t.Y8G("routerLink",t.eq3(11,F,o.id)),t.R7$(4),t.Y8G("routerLink",t.eq3(13,k,o.id)),t.R7$(4),t.Y8G("matMenuTriggerFor",s),t.R7$(5),t.vxM("draft"===o.status?28:29),t.R7$(13),t.SpI("",o.views||0," views"),t.R7$(5),t.SpI("",o.likes||0," likes")}}function U(n,i){if(1&n&&(t.j41(0,"div",8),t.Z7z(1,R,47,15,"div",10,u),t.k0s()),2&n){const o=t.XpG();t.R7$(),t.Dyx(o.allPosts())}}function O(n,i){1&n&&(t.j41(0,"div",6),t.nrm(1,"mat-spinner",9),t.k0s())}function y(n,i){1&n&&(t.j41(0,"div",7)(1,"h2"),t.EFF(2,"No published posts"),t.k0s(),t.j41(3,"p"),t.EFF(4,"Publish a draft to see it here."),t.k0s()())}function T(n,i){1&n&&(t.j41(0,"div",10),t.nrm(1,"mat-card"),t.k0s())}function B(n,i){if(1&n&&(t.j41(0,"div",8),t.Z7z(1,T,2,0,"div",10,u),t.k0s()),2&n){const o=t.XpG();t.R7$(),t.Dyx(o.publishedPosts())}}function $(n,i){1&n&&(t.j41(0,"div",6),t.nrm(1,"mat-spinner",9),t.k0s())}function A(n,i){1&n&&(t.j41(0,"div",7)(1,"h2"),t.EFF(2,"No draft posts"),t.k0s(),t.j41(3,"p"),t.EFF(4,"Save a post as draft to see it here."),t.k0s()())}function I(n,i){1&n&&(t.j41(0,"div",10),t.nrm(1,"mat-card"),t.k0s())}function L(n,i){if(1&n&&(t.j41(0,"div",8),t.Z7z(1,I,2,0,"div",10,u),t.k0s()),2&n){const o=t.XpG();t.R7$(),t.Dyx(o.draftPosts())}}let W=(()=>{class n{blogService=(0,t.WQX)(b.c);snackBar=(0,t.WQX)(v.UG);loading=(0,t.vPA)(!1);allPosts=(0,t.vPA)([]);publishedPosts(){return this.allPosts().filter(o=>"published"===o.status)}draftPosts(){return this.allPosts().filter(o=>"draft"===o.status)}ngOnInit(){this.loadUserPosts()}loadUserPosts(){var o=this;return(0,_.A)(function*(){try{o.loading.set(!0);const s=yield o.blogService.getUserPosts();o.allPosts.set(s)}catch(s){console.error("Error loading user posts:",s)}finally{o.loading.set(!1)}})()}getStatusColor(o){return"published"===o?"primary":""}formatDate(o){return o?(o.toDate?o.toDate():new Date(o)).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}generateExcerpt(o){if(o.excerpt)return o.excerpt;const s=o.content.replace(/<[^>]*>/g,"");return s.substring(0,150)+(s.length>150?"...":"")}publishPost(o){var s=this;return(0,_.A)(function*(){try{yield s.blogService.updatePost(o.id,{status:"published"}),s.snackBar.open("Post published successfully","Close",{duration:3e3}),s.loadUserPosts()}catch(e){console.error("Error publishing post:",e),s.snackBar.open("Failed to publish post","Close",{duration:3e3})}})()}unpublishPost(o){var s=this;return(0,_.A)(function*(){try{yield s.blogService.updatePost(o.id,{status:"draft"}),s.snackBar.open("Post unpublished","Close",{duration:3e3}),s.loadUserPosts()}catch(e){console.error("Error unpublishing post:",e),s.snackBar.open("Failed to unpublish post","Close",{duration:3e3})}})()}deletePost(o){var s=this;return(0,_.A)(function*(){try{s.allPosts.update(e=>e.filter(l=>l.id!==o.id)),s.snackBar.open("Post deleted","Close",{duration:3e3})}catch(e){console.error("Error deleting post:",e),s.snackBar.open("Failed to delete post","Close",{duration:3e3})}})()}static \u0275fac=function(s){return new(s||n)};static \u0275cmp=t.VBU({type:n,selectors:[["app-user-posts"]],decls:24,vars:9,consts:[["postMenu","matMenu"],[1,"container"],[1,"page-header"],["mat-raised-button","","color","primary","routerLink","/blog/create"],[3,"label"],[1,"posts-container"],[1,"loading-container"],[1,"empty-state"],[1,"post-list"],["diameter","40"],[1,"post-item"],[1,"post-status-badge"],["selected","",3,"color"],[1,"post-date"],[1,"post-excerpt"],["mat-button","","color","primary",3,"routerLink"],["mat-button","","color","accent",3,"routerLink"],["mat-icon-button","","aria-label","Post actions",3,"matMenuTriggerFor"],["mat-menu-item",""],["mat-menu-item","",3,"click"],["color","warn"],[1,"post-stats"],[1,"stat"]],template:function(s,e){1&s&&(t.j41(0,"div",1)(1,"div",2)(2,"h1"),t.EFF(3,"My Posts"),t.k0s(),t.j41(4,"a",3)(5,"mat-icon"),t.EFF(6,"add"),t.k0s(),t.EFF(7," Create New Post "),t.k0s()(),t.j41(8,"mat-tab-group")(9,"mat-tab",4)(10,"div",5),t.DNE(11,x,2,0,"div",6)(12,M,7,0,"div",7)(13,U,3,0,"div",8),t.k0s()(),t.j41(14,"mat-tab",4)(15,"div",5),t.DNE(16,O,2,0,"div",6)(17,y,5,0,"div",7)(18,B,3,0,"div",8),t.k0s()(),t.j41(19,"mat-tab",4)(20,"div",5),t.DNE(21,$,2,0,"div",6)(22,A,5,0,"div",7)(23,L,3,0,"div",8),t.k0s()()()()),2&s&&(t.R7$(9),t.Mz_("label","All Posts (",e.allPosts().length,")"),t.R7$(2),t.vxM(e.loading()?11:0===e.allPosts().length?12:13),t.R7$(3),t.Mz_("label","Published (",e.publishedPosts().length,")"),t.R7$(2),t.vxM(e.loading()?16:0===e.publishedPosts().length?17:18),t.R7$(3),t.Mz_("label","Drafts (",e.draftPosts().length,")"),t.R7$(2),t.vxM(e.loading()?21:0===e.draftPosts().length?22:23))},dependencies:[E.MD,P.iI,P.Wk,r.Hu,r.RN,r.YY,r.m2,r.WQ,r.MM,r.Lc,r.dh,d.Hl,d.It,d.iY,g.m_,g.An,p.RI,p.mq,p.T8,h.Y,C.YN,C.Jl,c.Cn,c.kk,c.fb,c.Cp,f.D6,f.LG],styles:[".container[_ngcontent-%COMP%]{max-width:1000px;margin:0 auto;padding:0 16px}.page-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.posts-container[_ngcontent-%COMP%]{padding:16px 0}.loading-container[_ngcontent-%COMP%], .empty-state[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;gap:16px;text-align:center;padding:32px}.post-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:16px}.post-status-badge[_ngcontent-%COMP%]{display:inline-block;margin-right:8px}.post-date[_ngcontent-%COMP%]{color:var(--text-secondary);font-size:.875rem}.post-excerpt[_ngcontent-%COMP%]{color:var(--text-secondary);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:0}.post-stats[_ngcontent-%COMP%]{display:flex;gap:16px;padding:8px 16px;font-size:.875rem;color:var(--text-secondary);border-top:1px solid var(--border-color)}.stat[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px}.stat[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:16px;height:16px;width:16px}"]})}return n})()}}]);