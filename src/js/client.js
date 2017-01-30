import React from "react"
import ReactDOM from "react-dom"
import Layout from "./components/Layout"
import styles from '../style.styl' // eslint-disable-line no-unused-vars
import 'jquery/dist/jquery.min.js' // Material Button
import 'materialize-css/bin/materialize.js' // Style

import 'webui-popover/dist/jquery.webui-popover.min.js'

const app = document.createElement('div')
app.id = "app"
document.body.appendChild(app);
ReactDOM.render(<Layout/>, app)

// $('a').webuiPopover({title:'Title',content:'Content'});

$('a').webuiPopover({
                        type:'async',
                        width: '500',
                        height: '400',
                        url:'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&origin=*&titles=JavaScript',
                        content:function(data){
                            console.log(data)
                            console.log(data.query.pages[9845].extract)
                            return data.query.pages[9845].extract;
                        }
                    });
