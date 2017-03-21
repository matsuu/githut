import React from 'react'
import { filter, sortBy, reverse, toString, omitBy, isNil, first,
    assign, take, includes, reject, pick, map, isEqual } from 'lodash/fp'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { NonLangStore } from '../stores/NonLangStore'
import { observer } from 'mobx-react'
import { autorun } from 'mobx'

@observer
export default class LangTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        };
    }

    latestDate(data) {
        return data
          | map(pick(['year', 'quarter']))
          | sortBy(['year', 'quarter'])
          | reverse
          | first
    }

    filterDate(data, year, quarter) {
        const nonLang = new NonLangStore().getConfig()
        return data
          | filter({year: year})
          | filter({quarter: quarter})
          | map(pick(['name', 'count']))
          | reject(o => includes(o.name)(nonLang.lang))
          | map.convert({'cap':0})((o, i) => assign({id: ++i})(o))
    }

    trendFormatter(cell, row) {
        const arrow = n => {
            const angle = dir => `<i class='fa fa-angle-${dir}'></i>`
            switch (true) {
                case n == 0:
                    return ''
                case n > 3:
                    return angle('double-up')
                case n < -3:
                    return angle('double-down')
                case n < 0:
                    return angle('down')
                case n > 0:
                    return angle('up')
                default: // direct jump to top 50 and previously unkown
                    return angle('double-up')
                }
            }
        return `${arrow(cell)}`
    }

    getTrend(current, last) {
        return current
          | map(cur => {
              const l = last
                | filter({ name: cur.name })
                | first
                | omitBy(isNil)
              return assign({ trend: l.id - cur.id })(cur)
            })
          | take(50)
    }

    componentDidMount() {
    this.handler = autorun(() => {
        if (!(this.props.store.ready))
            return

        const data = this.props.store.getData
        const { year, quarter } = data | this.latestDate
        const dec = i => --i | toString
        const curYearRanking = this.filterDate(data, year, quarter)
        const lastYearRanking = this.filterDate(data, dec(year), quarter)
        const langRanking = this.getTrend(curYearRanking, lastYearRanking)
        const newState = {
                ...this.state,
                data: langRanking
           }

        if (!isEqual(this.state, newState))
            this.setState(newState)
      })
    }

    static propTypes = {
            store: React.PropTypes.object.isRequired
    }

    render() {
        return (
            <BootstrapTable
                condensed
                tableStyle={ { margin: '30px auto 30px auto', width: '50%' } }
                data={this.state.data}
                bordered={false}
                options={this.options}>
                <TableHeaderColumn
                    width='150px'
                    dataAlign='center'
                    dataField='id'
                    isKey={true}>
                    # Ranking
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataAlign="center"
                    dataField='name'>
                    Programming Language
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataAlign="center"
                    dataField='trend'
                    dataFormat={ this.trendFormatter }>
                    Trend
                </TableHeaderColumn>
            </BootstrapTable>
        )
    }
}
