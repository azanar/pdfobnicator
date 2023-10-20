import { Component } from 'inferno';

import { LocalFileHandle } from '../../pdf/handle/local';
import { NewFileHandle } from '../../pdf/handle/new';

import { DocumentWell as Document } from './document'

export class EmptyWell extends Component {
    render() {
        return <div class="well collection-item">
            <span onClick={() => this.create()}><i class="fa-solid fa-file-circle-plus fa-2xl"></i></span>        
            <span onClick={() => this.open()}><i class="fa-solid fa-file-import fa-2xl"></i></span>        
        </div >
    }

    create() {
        var handle = new NewFileHandle;
        var well = <Document handle={handle} wells={this.props.wells}/>
        this.props.wells.add(well)
    }

    open() {
        const file = document.getElementById('file-selector').files[0]
        if (file === undefined) {
            return
        }
        const handle = new LocalFileHandle(file);
        /* FIXME: can not create element until the file load is done*/
        console.log("creating well for document " + handle.id)
        var well = <Document handle={handle} wells={this.props.wells}/>
        console.log("created well for document " + well.props.handle.id)
        this.props.wells.add(well)
    }
}