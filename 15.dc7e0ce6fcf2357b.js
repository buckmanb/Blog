"use strict";(self.webpackChunkblog_app=self.webpackChunkblog_app||[]).push([[15],{15:(y,p,a)=>{a.r(p),a.d(p,{PostListComponent:()=>R});var f=a(3014),t=a(3107),c=a(4460),_=a(4892),r=a(5329),l=a(9471),m=a(3220),g=a(3904),u=a(7818),d=a(1054),x=a(4466);const P=o=>["/blog",o],C=(o,s)=>s.id;function E(o,s){1&o&&(t.j41(0,"div",4),t.nrm(1,"mat-spinner",7),t.k0s())}function M(o,s){1&o&&(t.j41(0,"div",5)(1,"h2"),t.EFF(2,"No posts found"),t.k0s(),t.j41(3,"p"),t.EFF(4,"Check back later for new content."),t.k0s()())}function h(o,s){if(1&o&&t.nrm(0,"img",9),2&o){const n=t.XpG().$implicit;t.FS9("alt",n.title),t.Y8G("src",n.imageUrl,t.B4B)}}function v(o,s){if(1&o&&(t.j41(0,"mat-chip"),t.EFF(1),t.k0s()),2&o){const n=s.$implicit;t.R7$(),t.JRh(n)}}function O(o,s){if(1&o&&(t.j41(0,"mat-card",8),t.DNE(1,h,1,2,"img",9),t.j41(2,"mat-card-content")(3,"h2",10),t.EFF(4),t.k0s(),t.j41(5,"div",11)(6,"span",12),t.EFF(7),t.k0s(),t.j41(8,"span",13),t.EFF(9),t.k0s()(),t.j41(10,"p",14),t.EFF(11),t.k0s(),t.j41(12,"div",15),t.Z7z(13,v,2,1,"mat-chip",null,t.fX1),t.k0s(),t.j41(15,"div",16)(16,"span",17)(17,"mat-icon"),t.EFF(18,"favorite"),t.k0s(),t.EFF(19),t.k0s()()(),t.j41(20,"mat-card-actions")(21,"a",18),t.EFF(22,"Read More"),t.k0s()()()),2&o){const n=s.$implicit,e=t.XpG(2);t.R7$(),t.vxM(n.imageUrl?1:-1),t.R7$(3),t.JRh(n.title),t.R7$(3),t.JRh(e.formatDate(n.publishedAt)),t.R7$(2),t.SpI("by ",n.authorName,""),t.R7$(2),t.JRh(e.generateExcerpt(n)),t.R7$(2),t.Dyx(n.tags),t.R7$(6),t.SpI(" ",n.likes," "),t.R7$(2),t.Y8G("routerLink",t.eq3(7,P,n.id))}}function D(o,s){if(1&o&&t.Z7z(0,O,23,9,"mat-card",8,C),2&o){const n=t.XpG();t.Dyx(n.posts())}}function F(o,s){if(1&o){const n=t.RV6();t.j41(0,"div",19)(1,"button",20),t.bIt("click",function(){t.eBV(n);const i=t.XpG();return t.Njj(i.loadMore())}),t.EFF(2," Load More "),t.k0s()()}}let R=(()=>{class o{blogService=(0,t.WQX)(x.c);posts=(0,t.vPA)([]);loading=(0,t.vPA)(!1);ngOnInit(){this.loadPosts()}loadPosts(){var n=this;return(0,f.A)(function*(){try{n.loading.set(!0);const e=yield n.blogService.getPublishedPosts();n.posts.set(e)}catch(e){console.error("Error loading posts:",e)}finally{n.loading.set(!1)}})()}loadMore(){console.log("Load more posts")}formatDate(n){return n?(n.toDate?n.toDate():new Date(n)).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}generateExcerpt(n){if(n.excerpt)return n.excerpt;const e=n.content.replace(/<[^>]*>/g,"");return e.substring(0,150)+(e.length>150?"...":"")}static \u0275fac=function(e){return new(e||o)};static \u0275cmp=t.VBU({type:o,selectors:[["app-post-list"]],decls:9,vars:2,consts:[[1,"container"],[1,"page-title"],[1,"filters"],[1,"posts-grid"],[1,"loading-container"],[1,"empty-state"],["class","load-more",4,"ngIf"],["diameter","40"],[1,"post-card"],[1,"post-image",3,"src","alt"],[1,"post-title"],[1,"post-meta"],[1,"post-date"],[1,"post-author"],[1,"post-excerpt"],[1,"post-tags"],[1,"post-stats"],[1,"likes"],["mat-button","","color","primary",3,"routerLink"],[1,"load-more"],["mat-button","","color","primary",3,"click"]],template:function(e,i){1&e&&(t.j41(0,"div",0)(1,"h1",1),t.EFF(2,"Blog Posts"),t.k0s(),t.nrm(3,"div",2),t.j41(4,"div",3),t.DNE(5,E,2,0,"div",4)(6,M,5,0,"div",5)(7,D,2,0),t.k0s(),t.DNE(8,F,3,0,"div",6),t.k0s()),2&e&&(t.R7$(5),t.vxM(i.loading()?5:0===i.posts().length?6:7),t.R7$(3),t.Y8G("ngIf",i.posts().length>0&&!i.loading()))},dependencies:[c.MD,c.bT,_.iI,_.Wk,r.Hu,r.RN,r.YY,r.m2,l.Hl,l.It,l.$z,m.YN,m.Jl,g.m_,g.An,u.Cn,d.D6,d.LG],styles:[".container[_ngcontent-%COMP%]{max-width:1200px;margin:0 auto;padding:0 16px}.page-title[_ngcontent-%COMP%]{margin-bottom:24px;font-size:2rem}.filters[_ngcontent-%COMP%]{margin-bottom:24px}.posts-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin-bottom:32px}.post-card[_ngcontent-%COMP%]{height:100%;display:flex;flex-direction:column;transition:transform .2s ease,box-shadow .2s ease}.post-card[_ngcontent-%COMP%]:hover{transform:translateY(-4px);box-shadow:var(--elevation-3)}.post-image[_ngcontent-%COMP%]{height:200px;width:100%;object-fit:cover;aspect-ratio:16/9;max-height:250px}.post-title[_ngcontent-%COMP%]{margin-top:0;margin-bottom:8px;font-size:1.5rem}.post-meta[_ngcontent-%COMP%]{display:flex;font-size:.875rem;color:var(--text-secondary);margin-bottom:12px;gap:8px}.post-excerpt[_ngcontent-%COMP%]{margin-bottom:16px;line-height:1.5}.post-tags[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}.post-stats[_ngcontent-%COMP%]{display:flex;gap:16px;font-size:.875rem;color:var(--text-secondary)}.likes[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px}.likes[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:18px;height:18px;width:18px}.loading-container[_ngcontent-%COMP%]{display:flex;justify-content:center;padding:32px;grid-column:1/-1}.empty-state[_ngcontent-%COMP%]{text-align:center;padding:32px;grid-column:1/-1}.load-more[_ngcontent-%COMP%]{display:flex;justify-content:center;margin:24px 0 32px}@media (max-width: 768px){.posts-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}}"]})}return o})()}}]);