const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GooglePlay search App', () => {
    it('should return a message from GET /', () => {
      return supertest(app)
        .get('/playApps')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).is.an('array');
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0]).to.includes.keys(
                'App','Size','Price'
            );
        });
    });

    it('should return 400 if sort query is not rating or app', () => {
        return supertest(app)
            .get('/playApps')
            .query({ sort: 'invalid' })
            .expect(400, { error: 'Sort query must be of "rating" or "app"'})
    })

    it('should return apps sorted by name', async () => {
        const res = await supertest(app)
            .get('/playApps')
            .query({ sort: 'App' })
            .expect(200);
        let i = 0, sorted = true;
        while (sorted && i < res.body.length - 1) {
            sorted = sorted && res.body[i].App < res.body[i + 1].App;
            i++;
        }
        expect(sorted).to.be.true;
    });

    it('should return 400 if genre query is not valid', () => {
        return supertest(app)
            .get('/playApps')
            .query({ genres: 'invalid' })
            .expect(400, { error: 'Not a valid genres'})
    })

    it('should only contain searched for genre', async () => {
        const res = await supertest(app)
            .get('/playApps')
            .query({ genres: 'Arcade' })
            .expect(200)
            .then(res => {
                let i = 0, matching = true;
                while (matching && i < res.body.length -1) {
                    matching = matching && res.body[i].Genres === 'Arcade';
                    i++
                }
                   
            })
    })

});