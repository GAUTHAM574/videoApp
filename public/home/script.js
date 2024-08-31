const join_form = document.querySelector('.JoinInnerContainer');
const create_form = document.querySelector('.CreateInnerContainer');
const render_join_form = () => {
    console.log('render_join_form', join_form, create_form);
    join_form.style.display = 'block';
    create_form.style.display = 'none';
}

const render_create_form = () => {
    console.log('render_create_form');
    create_form.style.display = 'block';
    join_form.style.display = 'none';
}