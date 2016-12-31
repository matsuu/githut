import React from "react"
import LangChart from "./LangChart"
import LangTable from "./LangTable"
import SizeBarChart from "./SizeBarChart"
import LicensePie from "./LicensePie"
import Head from "./Head"
import Header from "./Header"
import Content from "./Content"
import Footer from "./Footer"
import TopLangStore from '../stores/TopLangStore'


export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Head/>
        <Header/>
        <LangChart store={TopLangStore}/>
        <LangTable/>
        <SizeBarChart store={TopLangStore}/>
        <LicensePie/>
        <Content/>
        <Footer/>
      </div>
    );
  }
}
