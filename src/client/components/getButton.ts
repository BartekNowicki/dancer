export const getButton = (actionName:string):HTMLDivElement => {
    const btn:HTMLDivElement = document.createElement('div');
    btn.innerHTML = `<span>${actionName}</span>`;
    btn.classList.add('btn');
    btn.classList.add(actionName);
    document.getElementById('webgl')?.appendChild(btn);
    return btn;
}

