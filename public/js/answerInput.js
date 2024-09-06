class AnswerInput {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            throw new Error(`Element with id '${elementId}' not found`);
        }
        this.initializeRichTextEditor();
    }

    initializeRichTextEditor() {
        const toolbar = document.createElement('div');
        toolbar.innerHTML = `
            <button data-command="bold" title="Bold"><i class="fas fa-bold"></i></button>
            <button data-command="italic" title="Italic"><i class="fas fa-italic"></i></button>
            <button data-command="underline" title="Underline"><i class="fas fa-underline"></i></button>
            <button data-command="insertUnorderedList" title="Bullet List"><i class="fas fa-list-ul"></i></button>
            <button data-command="insertOrderedList" title="Numbered List"><i class="fas fa-list-ol"></i></button>
        `;
        this.element.parentNode.insertBefore(toolbar, this.element);

        toolbar.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.execCommand(button.dataset.command);
            });
        });

        this.element.contentEditable = true;
        this.element.style.border = '1px solid #ccc';
        this.element.style.padding = '10px';
        this.element.style.minHeight = '200px';
    }

    execCommand(command) {
        document.execCommand(command, false, null);
        this.element.focus();
    }

    getContent() {
        return this.element.innerHTML;
    }

    setContent(content) {
        this.element.innerHTML = content;
    }

    clear() {
        this.element.innerHTML = '';
    }
}

export default AnswerInput;