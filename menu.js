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

            let template = document.createElement("nav");
            template.innerHTML = templateHtml;

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