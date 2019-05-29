import React from 'react'


export class Card extends React.Component {

    render() {
        const { header, content, footer, className } = this.props.children;
        const classes = ['card', className].join(' ');
        return (
            <div className={classes}>
                <header className="card-header">
                    {header}
                </header>
                <div className="card-content">
                    {content}
                </div>
                <footer className="card-footer">
                    {footer}
                </footer>
            </div>
        )
    }
}