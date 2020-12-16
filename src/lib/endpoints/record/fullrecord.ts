import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';
import MinimalDemon, { IMinimalDemon } from '../demon/minimaldemon';
import Note from '../note';
import DatabasePlayer, { IDatabasePlayer } from '../player/databaseplayer';
import { ISubmitter, Submitter } from '../submitter';

import RecordStatus from './recordstatus';

export interface IFullRecord extends IBaseData {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: IMinimalDemon;
	player: IDatabasePlayer;
	submitter?: ISubmitter;
	notes?: Note[];
}

/**
 * Full form of record
 * @see https://pointercrate.com/documentation/objects/#record
 */
export default class FullRecord extends BaseRequest implements IFullRecord {
	progress: number;
	video?: string;

	/**
	 * record status
	 * access to non approved records requires ExtendedAccess permissions
	 */
	status: RecordStatus;
	demon: MinimalDemon;
	player: DatabasePlayer;

	/**
	 * submitter for record
	 * access to submitter requires ListHelper permissions
	 */
	submitter?: Submitter;
	notes?: Note[];

	constructor({ id, progress, video, status, demon, player, notes, submitter }: IFullRecord,
		data: IBaseRequest) {
		super({ id }, data);
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.demon = new MinimalDemon(demon, { client: this.client });
		this.player = new DatabasePlayer(player, { client: this.client });

		if (submitter) {
			this.submitter = new Submitter(submitter, { client: this.client });
		}

		this.notes = notes;
	}

	/**
	 * deletes record
	 * be careful about using this object afterwards
	 */
	async delete() {
		if (!this.etag) {
			throw "etag is not defined for record";
		}

		this.client.records._delete(this.id, this.etag);
	}
}
