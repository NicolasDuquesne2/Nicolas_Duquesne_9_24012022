/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { fireEvent, screen } from "@testing-library/dom";
import { localStorageMock } from "../__mocks__/localStorage.js" // moked local storage imported
import { ROUTES } from "../constants/routes"
import store from "../__mocks__/store" // moked store imported
import userEvent from '@testing-library/user-event' //user events imported
import BillsUI from "../views/BillsUI.js"



describe("Given I am connected as an employee", () => {
  describe("When I am going to new bill page", () => {
    test("Then i should load a file with .jpg/.jpeg/.png extention", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'employee@test.tld'
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const store = null
      const newBillCont = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })

      const loadFileButton = screen.getByTestId('file')

      Object.defineProperty(loadFileButton, 'files', {
        value: [{name: 'facturefreemobile.jpeg'}],
        writable: false,
      })

      const regEx = new RegExp("(.jpeg|.jpg|.png)$", 'gs')

      expect(loadFileButton.files.length).toBe(1) //test on array files length. must equals one
      expect(loadFileButton.files[0].name).toMatch(regEx) // file name must match with regex

      const handleChangeFile = jest.fn(loadFileButton.handleChangeFile)
      loadFileButton.addEventListener('change', handleChangeFile)
      fireEvent.change(loadFileButton)
      expect(handleChangeFile).toHaveBeenCalled()
    })

    test("then i should send the form", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'employee@test.tld'
      }))

      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const newBillCont = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })

      newBillCont.fileUrl = ""
      newBillCont.fileName = ""

      const expenseType = screen.getByTestId('expense-type')
      expenseType.value = "Transports"
      const expenseName = screen.getByTestId('expense-name')
      expenseName.value = "trajet Bordeaux"
      const amountField = screen.getByTestId('amount')
      amountField.value = "35"
      const datePicker =  screen.getByTestId('datepicker')
      datePicker.value = "04/02/2022"
      const vat = screen.getByTestId('vat')
      vat.value = "70"
      const pct = screen.getByTestId('pct')
      pct.value = "20"
      const commentary = screen.getByTestId('commentary')
      commentary.value = "trajet TGV"

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBillCont.handleSubmit)
      newBillCont.updateBill = jest.fn().mockResolvedValue({})
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as Eployee", () => {
  describe("When I create a new bill by sending the form", () => {
    test("Sets bills into mock API POST", async () => {

      const newBill = {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": 20
      }

      const getSpy = jest.spyOn(store, "post")
      await store.post(newBill)
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenLastCalledWith(newBill)
    })

    test("post bills  via an API and fails with 404 message error", async () => {
      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    
    test("post bills  via an API and fails with 500 message error", async () => {
      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })

   
  })
})
