

describe('Database Connections', () => {

  it('connects to a postgres database', () => {
    cy.queryDatabase('SELECT * FROM config_params')
      .then((rows) => {
        console.log(rows);
        expect(rows.length).to.be.greaterThan(0);
      });
  });

});