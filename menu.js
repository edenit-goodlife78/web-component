customElements.define('test-menu',
    class extends HTMLElement{
        constructor(){
            super();
            const topmenu = ['menu1', 'menu2', 'menu3', 'menu4', 'menu5'];
            const submenu = [
                [],
                ['menu2-1','menu2-2'],
                [],
                [],
                []
            ];

            const templateHtml =`
                    <dl>
                        <dt class="nav-logo">logo</dt>
                        <dt class="nav-item">
                            <dl>
                            ${topmenu.map(item => `
                            <dt  class="nav-item level1">${item}</dt>
                            `).join('')}
                            </dl>
                        </dt>
                        <dt class="nav-icon">icon</dt>
                    </dl>
            `;

        let template = document.createElement("nav");
        template.innerHTML = templateHtml;

        const shadow = this.attachShadow({mode: 'open'});
        // shadow.appendChild(templateContent.cloneNode(true));
        shadow.appendChild(template);

        //외부스타일시트 적용
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'menuStyle.css');

        shadow.appendChild(linkElem);

        //subment 달아주기
        let level1 = template.querySelectorAll(".nav-item.level1");
        for(let i=0; i<level1.length ;i++){
            // console.log(level1[i]);
            if(submenu[i].length > 0){
                let tmpString = "<dl>";
                submenu[i].forEach(item=> {tmpString+=`<dt class="nav-item level2">${item}</dt>`;});
                level1[i].innerHTML+=tmpString + "</dt>";

                level1[i].addEventListener('mouseover',function(){
                    level1[i].querySelector('dl').style.display="block";
                })
                level1[i].addEventListener('mouseout',function(){
                    level1[i].querySelector('dl').style.display="none";
                })

            }
        };

   


        
        }
    }
);
