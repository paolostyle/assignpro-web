/// <reference types="cypress" />

const type = text => cy.get('.handsontableInput').first().type(text);
const typeValues = text => cy.get('.handsontableInput').last().type(text);
const press = (...keys) => cy.get('body').type(keys.map(key => `{${key}}`).join(''));
const goToMainCell =
  (row, col) =>
    cy.get(`.ht_master tbody tr:nth-child(${row}) > .htCenter.htMiddle:nth-child(${col})`)

describe('Elements rendering testing', () => {
  it('renders headers properly', () => {
    cy.visit('http://localhost:8080');
    cy.contains('h4', 'Panel obliczeń');
    cy.contains('h4', 'Historia');
  });

  it('changes language', () => {
    cy.clearLocalStorage();
    cy.get('.change-language-button').click();
    cy.contains('h4', 'Calculation panel');
  });

  it('solves a simple task', () => {
    cy.get('.ht_clone_top .htCenter.htMiddle.header-cell:nth-child(2)')
      .click();

    press('enter');
    type('Pleasant E2E');
    press('rightarrow', 'enter');
    type('Terrible E2E');

    cy.get('.ht_clone_left tbody tr:nth-child(2) > .htCenter.htMiddle.header-cell')
      .click();

    press('enter');
    type('Protractor');
    press('downarrow', 'enter');
    type('Cypress');

    goToMainCell(2, 2).click();
    press('enter');
    typeValues('100');

    goToMainCell(2, 3).click();
    press('enter');
    typeValues('15');

    goToMainCell(3, 2).click();
    press('enter');
    typeValues('10');

    goToMainCell(3, 3).click();
    press('enter');
    typeValues('150');

    cy.get('.solve-button')
      .click();

    goToMainCell(2, 3).should('have.class', 'optimal-cell');
    goToMainCell(3, 2).should('have.class', 'optimal-cell');
  })
});
