/// <reference types="cypress" />

describe("Probar CRUD", () => {

  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/index.html");
  });

  it("Revisar que existan los elementos", () => {

    // Comprobar que exista el titulo de la web
    cy.get("[data-cy='titulo-web']")
      .invoke("text")
      .should("equal", "Administrador de Tareas");

    // Comprobar que exista el boton fijo
    cy.get("[data-cy='btn-fijo']")
      .should("exist");

    // Comprobar que al inicio aun no existan tareas creadas
    setTimeout(() => {
      cy.get("[data-cy='contenedor-tarea']")
        .should("not.exist");
    }, 1000);
  });

  it("Crear Tarea", () => {

    // Presionar btn-fijo
    cy.get("[data-cy='btn-fijo']")
      .click();

    // Probar validacion
    cy.get("[data-cy='formulario']")
      .submit();

    cy.get("[data-cy='input-nombre']")
      .should("have.class", "error-input");

    cy.get("[data-cy='input-descripcion']")
      .should("have.class", "error-input");

    cy.get("[data-cy='input-fecha']")
      .should("have.class", "error-input");

    // LLenar inputs
    cy.get("[data-cy='input-nombre']")
      .type("Tarea de Física");

    cy.get("[data-cy='input-descripcion']")
      .type("Hacer ejercicios 1, 2 y 3 del nuevo tema.");

    cy.get("[data-cy='input-fecha']")
      .type("2024-11-05");

    cy.get("[data-cy='select-prioridad']")
      .select("Alta");

    // Crear tarea
    cy.get("[data-cy='formulario']")
      .submit();

    // Comprobar de que exista la tarea
    cy.get("[data-cy='contenedor-tarea']")
      .should("exist");

    // Abrir descripcion de la tarea
    cy.get("[data-cy='btn-descripcion']")
      .click();

    // Cerrar descripcion de la tarea
    cy.get("[data-cy='btn-descripcion']")
      .click();
  });

  it("Editar Tarea", () => {

    // Presionar boton de editar
    cy.get("[data-cy='btn-editar']")
      .click();

    // Modificar inputs
    cy.get("[data-cy='input-nombre']")
      .clear()
      .type("Tarea de Física (NUEVO)");

    cy.get("[data-cy='select-prioridad']")
      .select("Media");

    // Editar tarea
    cy.get("[data-cy='formulario']")
      .submit();

    // Comprobar de que exista la tarea
    cy.get("[data-cy='contenedor-tarea']")
      .should("exist");
  });

  it("Eliminar Tarea", () => {
    
    // Presionar boton de eliminar
    cy.get("[data-cy='btn-eliminar']")
      .click();

    // Confirmar la eliminacion de la tarea
    cy.get("[data-cy='overlay-alerta'] [data-cy='btn-aceptar']")
      .click();

    // Comprobar de que ya no exista la tarea
    cy.get("[data-cy='contenedor-tarea']")
      .should("not.exist");
  });
});