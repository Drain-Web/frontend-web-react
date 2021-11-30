import React from 'react'
import { Form } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

/* Select box for the subfilters of area and event
 *  idTitleList: Array of [option_id, option_title] pairs
 *  onChangeFunction: function to be triggered when select box is changed
 *  selectedId:
 */

export const SubFilterSelectBox = (
  { idTitleList, onChangeFunction, selectedId, label }) => {
  //

  return (
    <FloatingLabel label={label}>
      <Form.Control
        as='select'
        defaultValue={selectedId}
        onChange={onChangeFunction}
        className='rounded-1'
        label={label}
      >
        {
          idTitleList.map(
            ([geoId, geoTitle]) => (
              <option value={geoId} key={geoId}>{geoTitle}</option>
            )
          )
        }
      </Form.Control>
    </FloatingLabel>
  )
}
