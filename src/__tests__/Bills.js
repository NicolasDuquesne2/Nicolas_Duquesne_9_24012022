/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { Bills} from "../containers/Bills.js" //sort function imported
import { localStorageMock } from "../__mocks__/localStorage.js" // moked local storage imported
import { ROUTES, ROUTES_PATH } from "../constants/routes" // routes imported
import userEvent from '@testing-library/user-event' //user events imported
import store from "../__mocks__/store" // moked store imported
import Router from "../app/Router.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user) // set moked local storage
      
      const pathName = ROUTES_PATH['Bills']
      Object.defineProperty(window, 'location', { value: { hash: pathName} })
      document.body.innerHTML = "<div id='root'></div>"
      Router()
      const billIcon = screen.getByTestId("icon-window") // get the bill icon
      expect(billIcon).toHaveProperty("className", 'active-icon')
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe('Given I am connected as employee and I am on bills page and I clicked on a bill', () => {
  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({ data: [bills[0]] })
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const billsCont = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })

      const eye = screen.getByTestId('icon-eye')
      const handleClickIconEye = jest.fn(billsCont.handleClickIconEye(eye))
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFileEmployee')
      expect(modale).toBeTruthy()
    })
  })
})

describe('Given I am connected as employee and I am on bills page and I clicked on a new bill', () => {
  describe('When I click on the new bill button', () => {
    test('we sould be on new bill page', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({ data: [bills[0]] })
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const billsCont = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })

      const newBillButton = screen.getByTestId('btn-new-bill')
      const handleClickButton = jest.fn(billsCont.handleClickNewBill)
      newBillButton.addEventListener('click', handleClickButton)
      userEvent.click(newBillButton)
      expect(handleClickButton).toHaveBeenCalled()

      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I am on the bills page (just after connexion)", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(store, "get")
       const bills = await store.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})