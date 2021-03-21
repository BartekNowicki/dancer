export const getLoaderBlind = ():HTMLDivElement => {
    const blind:HTMLDivElement = document.createElement('div');
    blind.classList.add('blind');
    const loaderProgressBar:HTMLDivElement = document.createElement('div');
    loaderProgressBar.classList.add('loaderProgressBar');
    blind.appendChild(loaderProgressBar);
    document.getElementById('webgl')?.appendChild(blind);
    return blind;
}

