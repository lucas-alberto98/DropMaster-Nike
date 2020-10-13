import logger from '../../helpers/logger';
import { expect } from 'chai';
import CalendarService from '../../../services/artwalk/CalendarService';

describe('testing artwalk calendar service', () => {
    it('getCalendar should return array of sneakers', async () => {
        const calendar = await CalendarService.getCalendar();
        logger(calendar);
        expect(Array.isArray(calendar)).to.be.true;
    }).timeout(5000);
});
