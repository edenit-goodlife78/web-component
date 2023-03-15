const topmenu = ['menu1', 'menu2', 'menu3', 'menu4', 'menu5'];
const submenu = [
    [],
    [{link:'index.html',menu:'menu2-1'},{link:"#",menu:'menu2-2'}],
    [{link:'#',menu:'menu3-1'},{link:"#",menu:'menu3-2'},{link:"#",menu:'menu3-3'}],
    [],
    []
];

customElements.define('top-menu',
    class extends HTMLElement{
        constructor(){
            super();
            const templateHtml =`
                <nav>
                    <dl>
                        <dt class="nav-logo">logo</dt>
                        <dt class="nav-item">
                            <dl>
                                ${topmenu.map(item => `<dt  class="nav-item level1">${item}</dt>`).join('')}
                            </dl>
                        </dt>
                        <dt class="nav-icon">icon</dt>
                    </dl>
                </nav>
            `;

            // let template = document.createElement("nav");
            // template.innerHTML = templateHtml;

            // const shadow = this.attachShadow({mode: 'open'});
            // // shadow.appendChild(templateContent.cloneNode(true));
            // shadow.appendChild(template);
            this.innerHTML = templateHtml;

            //외부스타일시트 적용
            // const linkElem = document.createElement('link');
            // linkElem.setAttribute('rel', 'stylesheet');
            // linkElem.setAttribute('href', 'menuStyle.css');      
            // // shadow.appendChild(linkElem);
            // this.appendChild(linkElem);

            //submenu 달아주기
            // let level1 = template.querySelectorAll(".nav-item.level1");
            let level1 = this.querySelectorAll(".nav-item.level1");
            for(let i=0; i<level1.length ;i++){
                // console.log(level1[i]);
                if(submenu[i].length > 0){
                    let tmpString = "<dl>";
                    submenu[i].forEach(item=> {tmpString+=`<dt class="nav-item level2" ><a href=${item.link}>${item.menu}</a></dt>`;});
                    level1[i].innerHTML+=tmpString + "</dt>";

                    level1[i].addEventListener('mouseenter',function(e){
                        // level1[i].querySelector('dl').style.display="block";
                        e.target.children[0].style.display = "block";
                        console.log("menu mouseenter");
                    })
                    level1[i].addEventListener('mouseleave',function(e){
                        // level1[i].querySelector('dl').style.display="none";
                        e.target.children[0].style.display = "none";
                        console.log("menu mouseleave");
                    })

                }
            };

   
        
        }
    }
);


customElements.define('ext-select', 
    // class extends HTMLSelectElement{
    class extends HTMLElement{
        constructor(){
            self = super();
            // const shadow = self.attachShadow({mode:'open'});
            const templateHtml =`
                <select id="select1">
                ${topmenu.map(item => `<option value="${item}">${item}</option>`).join('')}
                </select>
                <select id="select2">
                <option>-no sub menu-</option>
                </select>
            `;

            // let template = document.createElement("select");
            this.innerHTML = templateHtml;

            this.onchange = function(e){
                if(e.target.id == "select1"){
                    console.log("select1 change!", e.currentTarget);
                    e.target.id

                    //   this.children[1].value = e.target.value;
                    let selectIndex = e.target.selectedIndex;
                    if(submenu[selectIndex].length > 0){
                        this.children[1].innerHTML = submenu[selectIndex].map(item => `<option value="${item.menu}">${item.menu}</option>`).join('');
                        console.log("list yes", selectIndex);
                    }else{
                        this.children[1].innerHTML = "<option>-no sub menu-</option>";
                        console.log("list no");
                    }
                }

                if(e.target.id == "select2")  console.log("select2 change!")
            }
        }

    }
    // ,{extends:'select'}
);




//------------------------------------------ bootstrap 적용된 페이지에서 component 작업 test

/*
* common component
* create date : 2023.02.14 
* author : goodlife78@edenitsolution.com
* header, footer, pagination 등 공통으로 쓰는 부분을 CustomHtml로 컴포넌트화함.
*/
customElements.define('top-menu2',
    class extends HTMLElement{
        constructor(){
            console.log("component top-menu");
            super();
            
            const templateHtml = `
                <header class="header">
                <div class="container">
                    <a href="#" class="header_logo">
                        <img src="assets/img/logo_b.png" alt="logo" />
                    </a>
                    <ul class="header_nav">
                        ${topmenu.map(item => `<li><a href="#">${item}</a><li>`).join('')}
                    </ul>
                    <div class="header_icon">
                        <ul>
                        <li>
                            <a href="#">
                            <img src="assets/img/i_my.png" alt="" data-bs-toggle="tooltip" data-bs-placement="bottom"title="로그인/회원가입"/>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                            <img src="assets/img/i_global.png" alt="" title="언어선택" />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                            <img src="assets/img/i_list.png" alt="" title="사이트맵"/>
                            </a>
                        </li>
                        </ul>
                    </div>
                </div>
                </header>            
            `;

            this.innerHTML = templateHtml;
        }
    }
);


//----- pagenation version1 ---
const pageNavSet = 5;   // 보여줄 페이지Nav수 예)5=><< < 1 2 3 4 5 > >> ,  3=> << < 1 2 3 > >>
let pageNavObj;
customElements.define('ext-pagination',
    class extends HTMLElement{
        constructor(){

            super();
            // const shadow = this.attachShadow({mode: 'open'})
            pageNavObj = this;
            this.activeObj;         //선택된 Page번호객체
            this.firstObj;
            this.prevObj;
            this.nextObj;
            this.lastObj;

            
            //pageNaveSet, viewListCnt, viewStartPage 값 초기화
            this.viewListCnt = 10;;   //한화면에 보여줄 리스트수
            this.viewStartPage = 1;    //pageNav에서 보여줄 시작페이지 번호 예) 1=> << < 1 2 3 4 5 > >> , 6=> << < 6 7 8 9 10 > >>
            this.viewlastPage = pageNavSet;
            this.totalListCnt = 150;     //해당 메뉴에서 검색된 리스트의 총개수 (서버로부터 받아야함)
            this.lastPage = Math.ceil(this.totalListCnt/pageNavSet); //

            let tmpListView = Number(this.getAttribute('listview'));
            if(!tmpListView) this.viewListCnt = tmpListView;

            let tmpStr = `<li class="page-item num active"><span class="page-link" value="${this.viewStartPage}">${this.viewStartPage}</span></li>`;
            // console.log(viewStartPage,viewlastPage,pageNavSet);
            for(let i=(this.viewStartPage+1); i<=this.viewlastPage;i++){
                tmpStr += `<li class="page-item num"><span class="page-link" value="${i}">${i}</span></li>`;
            }
 
            const templateHtml = `
                <nav>
                    <ul class="pagination">
                        <li class="page-item first">
                            <button class="page-link" value="1" disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                    <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                </svg>
                            </button>
                        </li>
                        <li class="page-item prev">
                            <span class="page-link" value="${this.viewStartPage-1}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                </svg>                        
                            </span>
                        </li>
                        ${tmpStr}
                        <li class="page-item next">
                            <span class="page-link" value="${this.viewlastPage+1}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                </svg>                        
                            </span>
                            </li>
                        <li class="page-item last">
                            <span class="page-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                                    <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                                </svg>                        
                            </span>
                        </li>
                    </ul>
                </nav>            
            `;

            this.innerHTML = templateHtml;

        }
        

        connectedCallback(){
            console.log("call connectedCallback")
            //activeObj로 등록
            this.activeObj = this.querySelector('.page-item.num.active');
            this.firstObj = this.querySelector('.page-item.first');
            this.prevObj = this.querySelector('.page-item.prev');
            this.nextObj = this.querySelector('.page-item.next');
            this.lastObj = this.querySelector('.page-item.last');
            // console.log(this.querySelector('.page-item.prev').value);
            
            // 앞으로 이동할 부분이 없을경우 display none로 설정
            this.firstObj.style.display = "none";
            this.prevObj.style.display = "none";

            //page버튼에 이벤트 달아주기
            this.firstObj.onclick = this.clickFirst;
            this.prevObj.onclick = this.clickPrev;
            this.nextObj.onclick = this.clickNext;
            this.lastObj.onclick = this.clicklast;

            //pageNo Element에 이벤트 달아주기
            // this.querySelector('.page-item.num').onclick = this.clickPageNo;
            let items = this.querySelectorAll('.page-item.num');
            let thisObj = this;
            items.forEach(function(item, index){
                item.onclick = thisObj.clickPageNo;
                // console.log(index);
            });

        }
        

        // << 버튼 클릭 (첫페이지로 이동)
        clickFirst = function(e){
            console.log("click first");
            this.viewStartPage = 1;    
            this.viewlastPage = pageNavSet;            
            //pageNavSet 재설정
            //activeObj 재등록

            //DATA가져와서 보여주기 - API Call
        }

        clickPrev = function(e){
            console.log("click prev");
            //pageNavSet 재설정
            //activeObj 재등록

            //DATA가져와서 보여주기 - API Call

        }

        clickNext = function(e){
            console.log("click next");
            //pageNavSet 재설정
            //activeObj 재등록

            //DATA가져와서 보여주기 - API Call

        }
        // >> 버튼 클릭 (마지막 페이지로 이동)
        clicklast = function(e){
            console.log("click last");
            //pageNavSet 재설정
            //activeObj 재등록

            //DATA가져와서 보여주기 - API Call

        }


        clickPageNo = function(e){
            console.log("click num");
            //이전 activeObj가 있으면,
            if(pageNavObj.activeObj){
                pageNavObj.activeObj.classList.remove('active');
                pageNavObj.activeObj.removeAttribute("aria-current");
            }

            pageNavObj.activeObj = e.target.parentElement;
            pageNavObj.activeObj.classList.add('active');
            pageNavObj.activeObj.setAttribute("aria-current","page");   //이속성은 bootstrap에서 쓰는데 정확한 용도는 모르겠음.

            //DATA가져와서 보여주기 - API Call
        }
    }
);




//----- pagenation version2 extendElement ---
customElements.define('ext-ul',
    class extends HTMLUListElement{
        constructor(){

            self= super();
            // const shadow = this.attachShadow({mode: 'open'})
            
            //pageNaveSet, viewListCnt, viewStartPage 값 초기화
            this.viewListCnt = 10;;   //한화면에 보여줄 리스트수
            this.viewStartPage = 1;    //pageNav에서 보여줄 시작페이지 번호 예) 1=> << < 1 2 3 4 5 > >> , 6=> << < 6 7 8 9 10 > >>
            this.viewlastPage = pageNavSet;

           //생성테그에서 listview값을 설정한경우 그 값을 적용한다!
            let tmpListView = Number(this.getAttribute('listview'));
            if(!tmpListView) this.viewListCnt = tmpListView;

            this.totalListCnt = 150;     //해당 메뉴에서 검색된 리스트의 총개수 (서버로부터 받아야함)
            this.lastPage = Math.ceil(this.totalListCnt/this.viewListCnt); //
            // console.log("lastPage : ", this.lastPage);


            this.firstObj = document.createElement('li');
            this.firstObj.classList.add('page-item');
            this.firstObj.classList.add('first');
            this.firstObj.innerHTML = `
            <button class="page-link" value="1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
            `;

            this.prevObj = document.createElement('li');
            this.prevObj.classList.add('page-item');
            this.prevObj.classList.add('prev');
            this.prevObj.innerHTML = `
            <span class="page-link" value="${this.viewStartPage-1}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>                        
            </span>
            `;

            this.nextObj = document.createElement('li');
            this.nextObj.classList.add('page-item');
            this.nextObj.classList.add('next');
            this.nextObj.innerHTML = `
            <span class="page-link" value="${this.viewlastPage+1}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>                        
            </span>
            `;

            this.lastObj = document.createElement('li');
            this.lastObj.classList.add('page-item');
            this.lastObj.classList.add('last');
            this.lastObj.innerHTML = `
            <span class="page-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                    <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>                        
            </span>
            `;

            this.appendChild(this.firstObj);
            this.appendChild(this.prevObj);
            this.numObjList=[];
            for(let i=this.viewStartPage; i<=this.viewlastPage;i++){
                let tmpObj = document.createElement('li');
                tmpObj.classList.add('page-item');
                tmpObj.classList.add('num');
                if(i==this.viewStartPage) tmpObj.classList.add('active')
                tmpObj.innerHTML = `<span class="page-link" value="${i}">${i}</span>`;
                this.appendChild(tmpObj);
                this.numObjList.push(tmpObj);
            }
            this.appendChild(this.nextObj);
            this.appendChild(this.lastObj);

            // console.log(this.numObjList);
        }
        

        connectedCallback(){
            console.log("call connectedCallback")
            //activeObj로 등록
            this.activeObj = this.querySelector('.page-item.num.active');
            console.log(this.activeObj );
            
            // 앞으로 이동할 부분이 없을경우 display none로 설정
            this.firstObj.style.display = "none";
            this.prevObj.style.display = "none";

            //page버튼에 이벤트 달아주기
            this.firstObj.onclick = this.clickFirst;
            this.prevObj.onclick = this.clickPrev;
            this.nextObj.onclick = this.clickNext;
            this.lastObj.onclick = this.clicklast;

            //pageNo Element에 이벤트 달아주기
            this.numObjList.forEach(function(item, index){
                item.onclick = self.clickPageNo;
                // console.log(index);
            });

        }
        

        // << 버튼 클릭 (첫페이지로 이동)
        clickFirst = function(e){
            console.log("click first");
            //pageNavSet 재설정
            self.viewStartPage = 1;    
            self.viewlastPage = pageNavSet;            

            // 앞으로 이동할 부분이 없을경우 display none로 설정
            self.firstObj.style.display = "none";
            self.prevObj.style.display = "none";
            
            self.prevObj.children[0].setAttribute("value", self.viewStartPage-1)
            //activeObj 재등록
            // self.activeObj = self.numObjList[0];

            //numPage 값 SET
            self.numObjList.forEach(function(item, index){
                item.children[0].setAttribute("value", self.viewStartPage+index);
                item.children[0].innerHTML = self.viewStartPage+index;
            });

            //prev PageSet 값 SET
            self.prevObj.children[0].setAttribute("value", self.viewStartPage-1)

            //next PageSet 값 SET
            self.nextObj.children[0].setAttribute("value", self.viewlastPage+1);
   

            //DATA가져와서 보여주기 - API Call
        }

        clickPrev = function(e){
            console.log("click prev");
            //pageNavSet 재설정
            let tmpValue = Number(self.prevObj.children[0].getAttribute("value"));

            self.viewStartPage = tmpValue-pageNavSet +1;
            self.viewLastPage = tmpValue;

            // 앞으로 이동할 부분이 있는지 체크 dispaly설정
            if(self.viewStartPage == 1){
                self.firstObj.style.display = "none";
                self.prevObj.style.display = "none";
            }

            //activeObj 재등록
            // self.activeObj = self.numObjList[pageNavSet-1];

            //numPage 값 SET
            self.numObjList.forEach(function(item, index){
                item.children[0].setAttribute("value", self.viewStartPage+index);
                item.children[0].innerHTML = self.viewStartPage+index;
            });

            //prev PageSet 값 SET
            self.prevObj.children[0].setAttribute("value", self.viewStartPage-1)

            //next PageSet 값 SET
            self.nextObj.children[0].setAttribute("value", self.viewLastPage+1)


            //DATA가져와서 보여주기 - API Call

        }

        clickNext = function(e){
            console.log("click next");
            //pageNavSet 재설정
            let tmpValue = Number(self.nextObj.children[0].getAttribute("value"));
            
            self.viewStartPage = tmpValue;
            self.viewLastPage = self.viewStartPage + pageNavSet -1;

            // 앞으로 이동할 부분이 이 있으므로 display none로 설정
            self.firstObj.style.display = "block";
            self.prevObj.style.display = "block";

            //activeObj 재등록
            // self.activeObj = self.numObjList[0];
            
            //numPage 값 SET
            self.numObjList.forEach(function(item, index){
                item.children[0].setAttribute("value", self.viewStartPage+index);
                item.children[0].innerHTML = self.viewStartPage+index;
            });

            //prev PageSet 값 SET
            self.prevObj.children[0].setAttribute("value", self.viewStartPage-1)

            //next PageSet 값 SET
            self.nextObj.children[0].setAttribute("value", self.viewLastPage+1)


            //totalCnt로 계산된 Page이상값은 dispaly= none처리

            //DATA가져와서 보여주기 - API Call

        }
        // >> 버튼 클릭 (마지막 페이지로 이동)
        clicklast = function(e){
            console.log("click last");
            //pageNavSet 재설정
            //activeObj 재등록

            //DATA가져와서 보여주기 - API Call

        }


        clickPageNo = function(e){
            console.log("click num");
            //이전 activeObj가 있으면,
            if(self.activeObj){
                self.activeObj.classList.remove('active');
                self.activeObj.removeAttribute("aria-current");
            }

            self.activeObj = e.target.parentElement;
            self.activeObj.classList.add('active');
            self.activeObj.setAttribute("aria-current","page");   //이속성은 bootstrap에서 쓰는데 정확한 용도는 모르겠음.

            //DATA가져와서 보여주기 - API Call
            apiCall();
        }

    },
    {extends:'ul'}
);


