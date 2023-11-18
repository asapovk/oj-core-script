import { _WordStamps } from "../../__boostorm/entities";

export interface _LoadGroupedWordStamps {
    seriesTitle: string;
    seriesSerieId: number;
    seriesMovieId: number;
    seriesWordStamps: Array<_WordStamps>
}