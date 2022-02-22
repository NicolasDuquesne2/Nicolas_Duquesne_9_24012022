export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
/**
 * input dateStr
 * output modDatestr or dateStr
 * 
 * this function converts french month short names into english version for dates in the format dd mmm yy.
 * checks if the date matches with the format targeted. If true, changes french names into english. 
 * If fals, returns the original date 
 */

export const formatShortMonthFrench = (dateStr) => {
  const regex = new RegExp(/([0-9]{1,2})\s([Fév|Avr|Mai|Jui|Aou|Déc]{3}.{1})\s([0-9]{2})$/i)

  if (dateStr.match(regex)) {
    const sec_group = dateStr.match(regex)[2]
    let enMonthName = ""

    switch (sec_group) {
      case "Fév." :
        enMonthName = "Feb."
        break
      case "Avr." :
        enMonthName = "Apr."
        break
      case "Mai." :
        enMonthName = "May."
        break
      case "Jui." :
        enMonthName = "Jul."
        break
      case "Aou." :
        enMonthName = "Aug."
        break
      case "Déc." :
        enMonthName = "Dec."
        break
      default :
    }

    const modDatestr = dateStr.replace(sec_group, enMonthName)
    
    return modDatestr
  }

  return dateStr
}


export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}