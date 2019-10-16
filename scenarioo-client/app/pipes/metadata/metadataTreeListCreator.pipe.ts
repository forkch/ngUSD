import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {MetadataTreeCreatorPipe} from './metadataTreeCreator.pipe';

declare var angular: angular.IAngularStatic;

@Pipe({
    name: 'scMetadataTreeListCreator',
})

@Injectable()
export class MetadataTreeListCreatorPipe implements PipeTransform {

    constructor(private metadataTreeCreatorPipe: MetadataTreeCreatorPipe) {
    }

    transform(metadata: any): any {

        const metadataTrees = {};

        Object.keys(metadata).forEach((key) => {
            const value = metadata[key];
            metadataTrees[key] = this.metadataTreeCreatorPipe.transform(value);
        });

        return metadataTrees;
    }
}
